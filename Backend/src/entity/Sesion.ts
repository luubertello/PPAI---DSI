// src/sesion/sesion.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './Usuario';

@Entity('sesion')
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fechaHoraInicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaHoraFin: Date | null;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  constructor(
    fechaHoraInicio?: Date,
    fechaHoraFin?: Date | null,
    usuario?: Usuario,
  ) {
    if (fechaHoraInicio) this.fechaHoraInicio = fechaHoraInicio;
    if (fechaHoraFin) this.fechaHoraFin = fechaHoraFin;
    if (usuario) this.usuario = usuario;
  }

  obtenerRILogueado(): Usuario | null {
    if (!this.fechaHoraFin) {
      return this.usuario;
    }
    return null;
  }
}
