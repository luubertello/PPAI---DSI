// src/usuario/usuario.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombreUsuario: string;

  @Column({ type: 'varchar', length: 255 })
  contraseña: string;

  constructor(contraseña?: string, nombreUsuario?: string) {
    if (contraseña) this.contraseña = contraseña;
    if (nombreUsuario) this.nombreUsuario = nombreUsuario;
  }

  // Getters simulados (opcional en TS)
  getNombreUsuario(): string {
    return this.nombreUsuario;
  }

  getContraseña(): string {
    return this.contraseña;
  }

  // Setters simulados (opcional en TS)
  setNombreUsuario(nombreUsuario: string): void {
    this.nombreUsuario = nombreUsuario;
  }

  setContraseña(contraseña: string): void {
    this.contraseña = contraseña;
  }
}