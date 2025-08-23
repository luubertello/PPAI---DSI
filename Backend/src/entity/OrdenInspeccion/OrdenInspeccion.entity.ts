// src/orden/orden-inspeccion.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Estado } from '../Estado/estado.entity';
import { EstacionSismologica } from '../EstacionSismologica/estacionSismologica.entity';
import { Empleado } from '../Empleado/empleado.entity';

@Entity('ordenInspeccion')
export class OrdenInspeccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fechaHoraInicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaHoraFinalizacion: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  fechaHoraCierre: Date | null;

  @Column()
  numeroOrden: number;

  @Column({ type: 'text', nullable: true })
  observacionCierre: string;

  // Relaciones

  @ManyToOne(() => Estado, estado => estado.ordenes)
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @ManyToOne(() => EstacionSismologica, estacion => estacion.ordenes)
  @JoinColumn({ name: 'codigoEstacion' })
  estacionSismologica: EstacionSismologica;

  @ManyToOne(() => Empleado, empleado => empleado.ordenes)
  @JoinColumn({ name: 'empleado_id' })
  empleado: Empleado;
  
  // Metodos
  getFechaHoraFinalizacion(): Date | null {
  return this.fechaHoraFinalizacion;
  }

  getNumeroOrden(): number {
    return this.numeroOrden;
  }

  setEstado(estado: Estado): void {
  this.estado = estado;
  }

  setFechaHoraCierre(fecha: Date): void {
    this.fechaHoraCierre = fecha;
  }
}
