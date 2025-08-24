// src/sesion/sesion.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../Usuario/usuario.entity';

@Entity('sesion')
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fechaHoraDesde: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaHoraHasta: Date | null;

  // Relacion de Sesion a Usuario
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
