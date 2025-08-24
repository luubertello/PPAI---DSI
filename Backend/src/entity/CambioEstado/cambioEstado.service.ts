import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CambioEstado } from '../CambioEstado/cambioEstado.entity';
import { Sismografo } from '../Sismografo/sismografo.entity';
import { Estado } from '../Estado/estado.entity';
import { IsNull } from 'typeorm';
import { MotivoFueraServicio } from '../MotivoFueraServicio/motivoFueraServicio.entity';

@Injectable()
export class CambioEstadoService {
  constructor(
    @InjectRepository(CambioEstado)
    private cambioEstadoRepo: Repository<CambioEstado>,

    @InjectRepository(MotivoFueraServicio)
    private motivoFueraServicioRepo: Repository<MotivoFueraServicio>,
  ) {}
  //Metodo crearCambioEstado
  async crearCambioEstado(
      sismografo: Sismografo,
      estado: Estado,
    ): Promise<CambioEstado> {
      // Buscar cambio de estado actual
        const cambioEstadoAbierto = await this.cambioEstadoRepo.findOne({
        where: {
            sismografo: sismografo,
            fechaHoraFin: IsNull(),
        },
        });

      // Si había uno abierto, lo cerramos
      if (cambioEstadoAbierto) {
        cambioEstadoAbierto.fechaHoraFin = new Date();
        await this.cambioEstadoRepo.save(cambioEstadoAbierto);
      }

      // Crear nuevo cambio de estado
      const nuevoCambio = this.cambioEstadoRepo.create({
        sismografo,
        estado,
        fechaHoraInicio: new Date(),
        fechaHoraFin: null,
      });

      return this.cambioEstadoRepo.save(nuevoCambio);
    }

     //Metodo crearMotivoFueraServicio
    async crearMotivoFueraServicio(
        cambioEstado: CambioEstado,
        comentario: string,
        ): Promise<MotivoFueraServicio> {
        // Crear el motivo
        const motivo = this.motivoFueraServicioRepo.create({
            comentario,
        });
        const motivoGuardado = await this.motivoFueraServicioRepo.save(motivo);

        // Relacionarlo con el cambio de estado
        cambioEstado.motivoFueraServicio = motivoGuardado;
        await this.cambioEstadoRepo.save(cambioEstado);

        return motivoGuardado;
        }

  }
