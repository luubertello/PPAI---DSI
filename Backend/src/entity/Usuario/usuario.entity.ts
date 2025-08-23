// src/usuario/usuario.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empleado } from '../Empleado/empleado.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombreUsuario: string;

  @Column({ type: 'varchar', length: 255 })
  contraseña: string;

  @ManyToOne(() => Empleado, { eager: true })
  @JoinColumn({ name: 'empleado_id' })
  empleado: Empleado;

  // Metodo para buscar empleado
  getEmpleado() {
    return this.empleado;
  }
}