import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './estado.entity';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
  ) {}

  // Crear un nuevo estado
  async crearEstado(nombreEstado: string, ambito: string): Promise<Estado> {
    const estado = this.estadoRepo.create({
      nombreEstado,
      ambito,
    });
    return await this.estadoRepo.save(estado);
  }
}