// src/motivo/motivo-tipo.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MotivoFueraServicio } from '../MotivoFueraServicio/motivoFueraServicio.entity';

@Entity('motivo_tipo')
export class MotivoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @OneToMany(() => MotivoFueraServicio, (motivo) => motivo.tipo)
  motivos: MotivoFueraServicio[];

  // Metodos

  getDescripcion(): string {
    return this.descripcion;
  }
}
