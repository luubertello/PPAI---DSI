// src/empleado/empleado.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Rol } from '../Rol/rol.entity';
import { OrdenInspeccion } from '../OrdenInspeccion/OrdenInspeccion.entity';
import { CambioEstado } from '../CambioEstado/cambioEstado.entity';
import { Usuario } from '../Usuario/usuario.entity';

@Entity('empleado')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 100 })
  mail: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  // Relaciones

  @ManyToOne(() => Rol, rol => rol.empleados, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @OneToMany(() => OrdenInspeccion, orden => orden.empleado)
  ordenes: OrdenInspeccion[];

  @OneToMany(() => CambioEstado, cambio => cambio.empleadoResponsable)
  cambiosDeEstado: CambioEstado[];

  @OneToMany(() => Usuario, usuario => usuario.empleado)
  usuarios: Usuario[];


 // Metodos

 obtenerMail() {
  return this.mail;
 }
 
  esResponsableReparacion(): boolean {
    return this.rol?.esResponsableReparacion?.() ?? false;
  }
}
