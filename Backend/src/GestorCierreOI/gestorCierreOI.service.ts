import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrdenInspeccion } from 'src/entity/OrdenInspeccion/OrdenInspeccion.entity';
import { EstacionSismologica } from 'src/entity/EstacionSismologica/estacionSismologica.entity';
import { Sismografo } from 'src/entity/Sismografo/sismografo.entity';
import { Estado } from 'src/entity/Estado/estado.entity';
import { MotivoTipo } from 'src/entity/MotivoTipo/motivoTipo.entity';
import { MotivoFueraServicio } from 'src/entity/MotivoFueraServicio/motivoFueraServicio.entity';
import { CambioEstado } from 'src/entity/CambioEstado/cambioEstado.entity';
import { Empleado } from 'src/entity/Empleado/empleado.entity';
import { Sesion } from 'src/entity/Sesion/sesion.entity';
import { Usuario } from 'src/entity/Usuario/usuario.entity';
import { CerrarOIDto } from 'src/DTO/cerrarOrden.DTO';

@Injectable()
export class GestorCierreOIService {
  constructor(
    @InjectRepository(OrdenInspeccion)
    private oiRepo: Repository<OrdenInspeccion>,
    @InjectRepository(Sesion) private sesionRepo: Repository<Sesion>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Empleado) private empRepo: Repository<Empleado>,
    @InjectRepository(Sismografo) private sismRepo: Repository<Sismografo>,
    @InjectRepository(Estado) private estadoRepo: Repository<Estado>,
    @InjectRepository(MotivoTipo)
    private motivoTipoRepo: Repository<MotivoTipo>,
    @InjectRepository(MotivoFueraServicio)
    private mfsRepo: Repository<MotivoFueraServicio>,
    @InjectRepository(CambioEstado)
    private cambioRepo: Repository<CambioEstado>,
    private readonly dataSource: DataSource,
  ) {}

  //busca las ordenes completamente realizadas del empleado, a través de la sesión activa
  async listarOrdenesCompletasDeRI(sesionId: number) {
    //ordenes del RI
    const sesion = await this.sesionRepo.findOne({
      where: { id: sesionId },
      relations: ['usuario', 'usuario.empleado'],
    });
    const empleado = sesion?.usuario?.empleado;
    if (!empleado) {
      throw new NotFoundException('Usuario/empleado no encontrado');
    }

    //ordenes completamente realizadas del RI
    const ordenes = await this.oiRepo.find({
      where: {
        empleado: { id: sesion.usuario.empleado.id },
        estado: 'COMPLETAMENTE_REALIZADA',
      },
      relations: ['estacion', 'estacion.sismografo'],
      order: { fechaHoraFinalizacion: 'DESC' },
    });

    //Alternativa 1: el RI NO tiene OI
    if (!ordenes.length) {
      throw new NotFoundException(
        'A1: El RI no tiene órdenes de inspección completamente realizadas',
      );
    }

    return ordenes;
  }

  async cerrarOrden(dto: CerrarOIDto) {
    //la observación debe estar (corresponde al paso 10)
    if (!dto.observacionCierre?.trim()) {
      throw new BadRequestException('La observación de cierre es obligatoria');
    }

    const sesion = await this.sesionRepo.findOne({
      where: { id: dto.sesionId },
      relations: ['usuario', 'usuario.empleado'],
    });
    const empleado = sesion?.usuario?.empleado;
    if (!empleado)
      throw new NotFoundException('Usuario/empleado no encontrado');

    const orden = await this.oiRepo.findOne({
      where: { id: dto.ordenId },
      relations: ['estacion', 'estacion.sismografo'],
    });
    if (!orden)
      throw new NotFoundException('Orden de inspección no encontrada');

    //validación de estado previo
    if (orden.estado !== 'COMPLETAMENTE_REALIZADA') {
      throw new BadRequestException(
        'La OI debe estar completamente realizada para su cierre.',
      );
    }

    //si la acción es FS, deben venir al menos 1 motivo (paso 6-7 y validación paso 10)
    if (dto.accionSismografo === 'FUERA_SERVICIO') {
      if (!dto.motivosFS?.length) {
        throw new BadRequestException(
          'Debe seleccionar al menos un motivo de Fuera de Servicio',
        );
      }
    }

    return this.dataSource.transaction(async (trx) => {
      // cerrar OI (paso 11)
      orden.estado = 'CERRADA';
      orden.observacionCierre = dto.observacionCierre.trim();
      orden.fechaHoraCierre = new Date();
      await trx.getRepository(OrdenInspeccion).save(orden);

      //actualizar estado del sismógrafo (paso 12 y Alterativa 2)
      const sismografo = await trx.getRepository(Sismografo).findOne({
        where: { id: orden.estacionSismologica.sismografo.id },
        relations: ['estadoActual'],
      });
      if (!sismografo) throw new NotFoundException('Sismógrafo no encontrado');

      const nombreEstado =
        dto.accionSismografo === 'FUERA_SERVICIO'
          ? 'FUERA_SERVICIO'
          : 'EN_LINEA';
      const estadoNuevo = await trx
        .getRepository(Estado)
        .findOne({ where: { nombreEstado: nombreEstado } });
      if (!estadoNuevo)
        throw new NotFoundException(`Estado ${nombreEstado} no parametrizado`);

      // cambio de estado + trazabilidad (RN 7 + paso 12 + Observación 2)
      const cambio = trx.getRepository(CambioEstado).create({
        sismografo,
        estado: estadoNuevo,
        fechaHora: new Date(),
        empleadoResponsable: empleado, // RI logueado
        observacion: dto.observacionCierre,
      });
      await trx.getRepository(CambioEstado).save(cambio);

      // 2.a) Asociar motivos si FS (pasos 6-7-12)
      if (dto.accionSismografo === 'FUERA_SERVICIO') {
        for (const m of dto.motivosFS!) {
          const tipo = await trx.getRepository(MotivoTipo).findOne({ where: { id: m.motivoTipoId } });
          if (!tipo)
            throw new NotFoundException(
              `MotivoTipo ${m.motivoTipoId} inexistente`,
            );
          const mfs = trx.getRepository(MotivoFueraServicio).create({
            cambioEstado: cambio,
            motivoTipo: tipo,
            comentario: m.comentario?.trim(),
          });
          await trx.getRepository(MotivoFueraServicio).save(mfs);
        }
      }

      //actualizar estado actual del sismógrafo
      sismografo.estadoActual = estadoNuevo;
      await trx.getRepository(Sismografo).save(sismografo);

      //Respuesta
      return {
        ok: true,
        ordenId: orden.id,
        sismografoId: sismografo.id,
        estadoSismografo: nombreEstado,
      };
    });
  }
}
