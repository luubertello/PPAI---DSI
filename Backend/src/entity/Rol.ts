// src/rol/rol.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from './Empleado';

@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcionRol: string;

  @OneToMany(() => Empleado, empleado => empleado.rol)
  empleados: Empleado[];

  esResponsableReparacion(): boolean {
    return this.nombre?.toLowerCase() === 'responsablereparacion';
  }
}
