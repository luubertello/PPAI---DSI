import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenInspeccion } from './OrdenInspeccion.entity';
import { Estado } from '../Estado/estado.entity';
import { Empleado } from '../Empleado/empleado.entity';

@Injectable()
export class OrdenInspeccionService {
  constructor(
    @InjectRepository(OrdenInspeccion)
    private readonly ordenRepo: Repository<OrdenInspeccion>,

    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,

    @InjectRepository(Empleado)
    private readonly empleadoRepo: Repository<Empleado>,
  ) {}

  // Cerrar una orden de inspección
  async cerrarOrden(id: number): Promise<OrdenInspeccion> {
    // Buscar la orden
    const orden = await this.ordenRepo.findOne({
      where: { numeroOrden: id },
      relations: ['estado'],
    });
    if (!orden) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    // Buscar estado 'cerrada'
    const estadoCerrada = await this.estadoRepo.findOne({
  where: {
    nombreEstado: 'CERRADA',
    ambito: 'ORDEN_INSPECCION', 
  },
});

if (!estadoCerrada) {
  throw new NotFoundException(`Estado 'CERRADA' no encontrado`);
}

// Setear valores usando tus métodos de la entidad
orden.setEstado(estadoCerrada);
orden.setFechaHoraCierre(new Date());

// Guardar y devolver
return await this.ordenRepo.save(orden);
  }

  // Verifica si la orden está en estado "COMPLETAMENTE REALIZADA"
  async esCompletamenteRealizada(idOrden: number): Promise<boolean> {
    const orden = await this.ordenRepo.findOne({
      where: { numeroOrden: idOrden },
      relations: ['estado'],
    });

    if (!orden) {
      throw new NotFoundException(`Orden con id ${idOrden} no encontrada`);
    }

    // Busca estado 'COMPLETAMENTE REALIZADA'
    const estadoCompletada = await this.estadoRepo.findOne({
      where: {
        nombreEstado: 'COMPLETAMENTE REALIZADA',
        ambito: 'ORDEN_INSPECCION',
      },
    });

    if (!estadoCompletada) {
      throw new NotFoundException(`Estado 'COMPLETAMENTE REALIZADA' no encontrado`);
    }

    return orden.estado.id === estadoCompletada.id;
  }

  // Verifica a que empleado pertenece la orden
  async esDeEmpleado(idOrden: number, idEmpleado: number): Promise<boolean> {
    const orden = await this.ordenRepo.findOne({
      where: { numeroOrden: idOrden },
      relations: ['empleado'],
    });

    if (!orden) {
      throw new NotFoundException(`Orden con id ${idOrden} no encontrada`);
    }

    // Busca el empleado
    const empleado = await this.empleadoRepo.findOne({
      where: { id: idEmpleado },
    });

    if (!empleado) {
      throw new NotFoundException(`Empleado con id ${idEmpleado} no encontrado`);
    }

    return orden.empleado.id === empleado.id;
  }
}
