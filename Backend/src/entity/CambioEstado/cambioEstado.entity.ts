// src/cambio-estado/cambio-estado.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Empleado } from './Empleado';
import { Estado } from './Estado';
import { MotivoTipo } from './MotivoTipo';
import { Sismografo } from './Sismografo';

@Entity('cambio_estado')
export class CambioEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  fechaHoraFin: Date | null;

  @Column({ type: 'timestamp' })
  fechaHoraInicio: Date;

  // Relación Muchos a Muchos con MotivoTipo
  @ManyToMany(() => MotivoTipo, { eager: true, cascade: true })
  @JoinTable({
    name: 'cambio_estado_motivo',
    joinColumn: { name: 'cambio_estado_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'motivo_tipo_id', referencedColumnName: 'id' },
  })
  motivos: MotivoTipo[];

  @ManyToOne(() => Empleado, { eager: true })
  @JoinColumn({ name: 'empleado_responsable_id' })
  empleadoResponsable: Empleado;

  @ManyToOne(() => Estado, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @ManyToOne(() => Sismografo, { eager: true })
  @JoinColumn({ name: 'sismografo_id' })
  sismografo: Sismografo;

constructor(
  fechaHoraInicio?: Date,
  fechaHoraFin?: Date | null,
  empleadoResponsable?: Empleado,
) {
  if (fechaHoraInicio) this.fechaHoraInicio = fechaHoraInicio;
  if (fechaHoraFin) this.fechaHoraFin = fechaHoraFin;
  if (empleadoResponsable) this.empleadoResponsable = empleadoResponsable;
}

  esEstadoActual(): boolean {
    return this.fechaHoraFin === null || this.fechaHoraFin === undefined;
  }
  
  esFueraDeServicio(): void {
  }
}