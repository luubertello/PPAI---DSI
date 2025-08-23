import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { CambioEstado } from '../CambioEstado/cambioEstado.entity';
import { Estado } from '../Estado/estado.entity';
import { MotivoTipo } from '../MotivoTipo/motivoTipo.entity';
import { Empleado } from '../Empleado/empleado.entity';
import { EstacionSismologica } from '../EstacionSismologica/estacionSismologica.entity';


@Entity('sismografo')
export class Sismografo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fechaAdquisicion: Date;

  @Column()
  identificadorSismografo: string;

  @Column()
  nroSerie: number;

  // Relaciones
  @OneToMany(() => CambioEstado, cambio => cambio.sismografo)
  cambiosDeEstado: CambioEstado[];

  @OneToMany(() => EstacionSismologica, es => es.sismografo)
  estaciones: EstacionSismologica[];

  @ManyToOne(() => Estado, { eager: true })
  @JoinColumn({ name: 'estado_actual_id' })
  estadoActual: Estado;

  // Metodos
  getIdentSismografo() {
  return this.identificadorSismografo;
  }

  setEstadoActual(estado: Estado) {
    this.estadoActual = estado;
  }

}