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

  private sesionActual?: Sesion;
  private empleadoResponsable: Empleado;
  private ordenesDisponibles: OrdenInspeccion[] = [];
  private ordenSeleccionada?: OrdenInspeccion;
  private observacionCierre?: string;
  private motivosSeleccionados: MotivoTipo[] = [];

  //Método Buscar empleado logueado a través de sesión
  async buscarEmpleadoLogueado(sesionId: number): Promise<Empleado> {
    const sesion = await this.sesionRepo.findOne({
      where: { id: sesionId },
      relations: ['usuario', 'usuario.empleado'],
    });
    const empleado = sesion?.usuario?.empleado;
    if (!empleado)
      throw new NotFoundException('Usuario/empleado no encontrado');
    this.sesionActual = sesion;
    this.empleadoResponsable = empleado;
    return empleado;
  }

  //Método Buscar OI CR
  async buscarOrdenInspCompletamenteRealizadas(
    sesionId: number,
  ): Promise<OrdenInspeccion[]> {
    const empleado = await this.buscarEmpleadoLogueado(sesionId);
    const ordenes = await this.oiRepo.find({
      where: {
        empleado: { id: empleado.id },
        estado: 'COMPLETAMENTE_REALIZADA' as any,
      },
      relations: ['estacion', 'estacion.sismografo'],
      //ordena por fecha de finalización
      order: { fechaHoraFinalizacion: 'DESC' as any },
    });
    this.ordenesDisponibles = ordenes;
    return ordenes;
  }

  //Método tomar seleccion de orden
  async tomarSeleccionOrden(idOrden: number): Promise<OrdenInspeccion> {
    const oi = await this.oiRepo.findOne({
      where: { id: idOrden },
      relations: ['estacion', 'estacion.sismografo', 'responsable'],
    });
    if (!oi) throw new NotFoundException('Orden de inspección inexistente.');
    if (oi.estado !== ('COMPLETAMENTE_ REALIZADA' as any)) {
      throw new BadRequestException(
        'La Orden de Inspección debe estar COMPLETAMENTE_REALIZADA para cerrarla',
      );
    }
    this.ordenSeleccionada = oi;
    return oi;
  }

  //Método tomar observación de cierre y es necesario que la observación esté (validarExistenciaObservacion())
  tomarObservacionCierre(texto: string): void {
    if (!texto || !texto.trim()) {
      throw new BadRequestException('La observación de cierre es obligatoria');
    }
    this.observacionCierre = texto.trim();
  }

  //Método habilitar actualización del estado del sismógrafo
  async habilitarActualizacionSituacionSismografo(): Promise<{
    motivos: MotivoTipo[];
  }> {
    const motivos = await this.motivoTipoRepo.find();
    return { motivos };
  }

  //Método buscar motivo tipo
  async buscarMotivoTipo(): Promise<MotivoTipo[]> {
    return this.motivoTipoRepo.find();
  }

  //Método tomar selección de motivo(s)
  tomarSeleccionMotivo(motivos: MotivoTipo[]): void {
    this.motivosSeleccionados =
      motivos?.map((m) => ({
        id: Number(m.id),
        //tomarComentario()
        descripcion: (m.descripcion ?? '').trim(),
      })) ?? [];
  }

  //Método tomar confirmación de cierre
  tomarConfrimacionCierre(): void {
    return;
  }
  //**************************************************************************************************************************** */
  // *******************************DE ACÁ EN ADELANTE ME CANSÉ Y COPIÉ Y PEGUÉ, HAY QUE VERLO BIEN!!  *****************************
  //****************************************************************************************************************************** */

  //Método para validar cantidad mínima de motivos
  private validarMotivosSeleccMinimo(decision: DecisionCierre, motivos: MotivoTipo[] | undefined) {
    if (decision === DecisionCierre.FUERA_SERVICIO) {
      if (!motivos?.length) {
        // Alternativa 3: faltan datos requeridos para FS
        throw new BadRequestException(
          'Debe seleccionar al menos un motivo de Fuera de Servicio',
        );
      }
    }
  }

  //Método del cierre de la OI
  async cerrarOrdenInspeccion(params: {
    idOrden: number;
    sesionId: number;
    decision: DecisionCierre; // ONLINE (Alternativa 2) o FUERA_SERVICIO
    motivosFS?: MotivoTipo[]; // requerido si FS
    observacion: string; // obligatorio
  }): Promise<{ ok: true; ordenId: number; nuevoEstadoSismografo: string }> {
    const { idOrden, sesionId, decision, motivosFS, observacion } = params;

    //validaciones previas (A3)
    this.tomarObservacionCierre(observacion);
    this.validarMotivosSeleccMinimo(decision, motivosFS);

    return this.ds.transaction(async (trx) => {
      // Sesión -> Usuario -> Empleado (RI)
      const sesion = await trx.getRepository(Sesion).findOne({
        where: { id: sesionId },
        relations: ['usuario', 'usuario.empleado'],
      });
      const ri = sesion?.usuario?.empleado;
      if (!ri) throw new NotFoundException('Sesión/usuario/empleado no encontrado');

      // OI seleccionada (debe estar COMPLETAMENTE_REALIZADA)
      const oi = await trx.getRepository(OrdenInspeccion).findOne({
        where: { id: idOrden },
        relations: ['estacion', 'estacion.sismografo', 'responsable'],
      });
      if (!oi) throw new NotFoundException('Orden de inspección inexistente');
      if (oi.estado !== ('COMPLETAMENTE_REALIZADA' as any)) {
        throw new BadRequestException('La OI no está COMPLETAMENTE_REALIZADA');
      }

      // Cerrar la OI
      oi.estado = 'CERRADA' as any;
      oi.observacionCierre = this.observacionCierre!;
      (oi as any).fechaCierre = new Date(); // ajusta si tu entidad ya tiene este campo
      await trx.getRepository(OrdenInspeccion).save(oi);

      // Estado destino del sismógrafo según decisión (A2 = ONLINE por defecto)
      const estadoDestinoNombre =
        decision === DecisionCierre.FUERA_SERVICIO ? 'FUERA_DE_SERVICIO' : 'ONLINE';
      const estadoDestino = await trx.getRepository(Estado).findOne({
        where: { nombre: estadoDestinoNombre },
      });
      if (!estadoDestino) throw new NotFoundException(`Estado ${estadoDestinoNombre} no parametrizado`);

      // Sismógrafo de la estación
      const sism = await trx.getRepository(Sismografo).findOne({
        where: { id: oi.estacion.sismografo.id },
        relations: ['estadoActual'],
      });
      if (!sism) throw new NotFoundException('Sismógrafo no encontrado');

      // Cerrar cambio actual (si tu modelo lo requiere) y crear nuevo cambio
      const nuevoCambio = trx.getRepository(CambioEstado).create({
        sismografo: sism,
        estado: estadoDestino,
        fechaHora: new Date(),
        responsable: ri,
        observacion: this.observacionCierre!,
      });
      await trx.getRepository(CambioEstado).save(nuevoCambio);

      // Si es FS: persistir motivos seleccionados (0..*)
      if (decision === DecisionCierre.FUERA_SERVICIO) {
        for (const m of (motivosFS ?? [])) {
          const tipo = await trx.getRepository(MotivoTipo).findOne({
            where: { id: m.motivoTipoId },
          });
          if (!tipo) throw new NotFoundException(`MotivoTipo ${m.motivoTipoId} no encontrado`);

          const mfs = trx.getRepository(MotivoFueraServicio).create({
            cambioEstado: nuevoCambio,
            motivoTipo: tipo,
            comentario: m.comentario,
          });
          await trx.getRepository(MotivoFueraServicio).save(mfs);
        }
      }

      // Actualizar estado actual del sismógrafo (si lo llevás denormalizado)
      (sism as any).estadoActual = estadoDestino;
      await trx.getRepository(Sismografo).save(sism);

      // Notificaciones (placeholders por trazabilidad)
      await this.enviarMail(oi, sism, estadoDestinoNombre, ri);
      await this.mostrarEnMonitor(oi, sism, estadoDestinoNombre);

      return { ok: true, ordenId: oi.id, nuevoEstadoSismografo: estadoDestinoNombre };
    });
  }

  //Método fin caso de uso
  finCU(): void {
    this.sesionActual = undefined;
    this.empleadoResponsable = undefined;
    this.ordenesDisponibles = [];
    this.ordenSeleccionada = undefined;
    this.observacionCierre = undefined;
    this.motivosSeleccionados = [];
  }
}
