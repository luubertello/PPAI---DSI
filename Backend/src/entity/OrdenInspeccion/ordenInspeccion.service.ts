import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenInspeccion } from './OrdenInspeccion.entity';
import { Estado } from '../Estado/estado.entity';
@Injectable()
export class OrdenInspeccionService {
  constructor(
    @InjectRepository(OrdenInspeccion)
    private readonly ordenRepo: Repository<OrdenInspeccion>,

    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
  ) {}

  // 🔹 Cerrar una orden de inspección
  async cerrarOrden(id: number): Promise<OrdenInspeccion> {
    // 1. Buscar la orden
    const orden = await this.ordenRepo.findOne({
      where: { numeroOrden: id },
      relations: ['estado'],
    });
    if (!orden) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    const estadoCerrada = await this.estadoRepo.findOne({
  where: {
    nombreEstado: 'CERRADA',
    ambito: 'ORDEN_INSPECCION', 
  },
});

if (!estadoCerrada) {
  throw new NotFoundException(`Estado 'CERRADA' no encontrado`);
}

// 3. Setear valores usando tus métodos de la entidad
orden.setEstado(estadoCerrada);
orden.setFechaHoraCierre(new Date());

// 4. Guardar y devolver
return await this.ordenRepo.save(orden);
  }
}
