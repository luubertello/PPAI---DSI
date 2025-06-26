// src/orden/orden-inspeccion.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Estado } from './Estado';
import { EstacionSismologica } from './EstacionSismologica';
import { Empleado } from './Empleado';

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
}
