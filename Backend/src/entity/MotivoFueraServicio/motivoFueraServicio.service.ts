import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MotivoFueraServicio } from './motivoFueraServicio.entity';

@Injectable()
export class MotivoFueraServicioService {
  constructor(
    @InjectRepository(MotivoFueraServicio)
    private readonly motivoFueraServicioRepo: Repository<MotivoFueraServicio>,
  ) {}

  async crearMotivoFueraServicio(comentario: string): Promise<MotivoFueraServicio> {
    const motivo = this.motivoFueraServicioRepo.create({
      comentario,
    });
    return await this.motivoFueraServicioRepo.save(motivo);
  }
}