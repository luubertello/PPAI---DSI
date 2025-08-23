import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sesion } from './sesion.entity';

@Injectable()
export class SesionService {
      constructor(
    @InjectRepository(Sesion)
    private sesionRepo: Repository<Sesion>,
  ) {}

    async buscarEmpleadoLogueado(sesionId: number) {
        const sesion = await this.sesionRepo.findOne({
        where: { id: sesionId },
        relations: ['usuario', 'usuario.empleado'],
        });
        return sesion?.usuario?.empleado ?? null;
    }
}