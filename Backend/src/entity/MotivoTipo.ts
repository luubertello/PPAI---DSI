// src/motivo/motivo-tipo.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('motivo_tipo')
export class MotivoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  constructor(descripcion?: string) {
    if (descripcion) {
      this.descripcion = descripcion;
    }
  }

  //Metodos

  getDescripcion(): string {
    return this.descripcion;
  }
}
