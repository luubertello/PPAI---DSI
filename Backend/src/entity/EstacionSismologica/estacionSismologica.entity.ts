// src/estacion/estacion-sismologica.entity.ts

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrdenInspeccion } from './OrdenInspeccion';
import { Sismografo } from './Sismografo';

@Entity('estacion_sismologica')
export class EstacionSismologica {
  @PrimaryColumn()
  codigoEstacion: number;

  @Column({ type: 'varchar', length: 255 })
  documentoCertificacionAdq: string;

  @Column({ type: 'date' })
  fechaSolicitudCertificacion: Date;

  @Column('double precision')
  latitud: number;

  @Column('double precision')
  longitud: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'int' })
  nroCertificacionAdquisicion: number;

  // Relaciones

  @ManyToOne(() => Sismografo, s => s.estaciones, { eager: true })
  @JoinColumn({ name: 'sismografo_id' })
  sismografo: Sismografo;

  @OneToMany(() => OrdenInspeccion, orden => orden.estacionSismologica)
  ordenes: OrdenInspeccion[];

  //Metodos
  getSismografo(): string {
    return this.sismografo?.identificadorSismografo ?? '';
  }
}