// src/rol/rol.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from '../Empleado/empleado.entity';

@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcionRol: string;

  // Relacion con Empleado
  @OneToMany(() => Empleado, empleado => empleado.rol)
  empleados: Empleado[];

  // Metodos

  getNombreRol() {
    return this.nombre;
  }

  esResponsableReparacion(): boolean {
    return this.nombre?.toLowerCase() === 'responsablereparacion';
  }
}
