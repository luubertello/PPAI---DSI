import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { CambioEstado } from '../CambioEstado/cambioEstado.entity';
import { OrdenInspeccion } from '../OrdenInspeccion/OrdenInspeccion.entity';
import { Sismografo } from '../Sismografo/sismografo.entity';

@Entity('estado')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombreEstado: string;

  @Column({ type: 'varchar', length: 50 })
  ambito: string;

  @OneToMany(() => CambioEstado, (cambio) => cambio.estado)
  cambios: CambioEstado[];

  @OneToMany(() => OrdenInspeccion, (orden) => orden.estado)
  ordenes: OrdenInspeccion[];

  @OneToMany(() => Sismografo, (sismografo) => sismografo.estadoActual)
  sismografo: Sismografo[];

  // Métodos
  esAmbitoSismografo(): boolean {
    return this.ambito.toLowerCase() === 'sismografo';
  }

  esAmbitoOrdenInspeccion(): boolean {
    return this.ambito.toLowerCase() === 'orden de inspeccion';
  }

  esCerrada(): boolean {
    return this.nombreEstado.toLowerCase() === 'cerrada';
  }

  esFueraDeServicio(): boolean {
    return this.nombreEstado.toLowerCase() === 'fuera de servicio';
  }

  esCompletamenteRealizada(): boolean {
  return this.nombreEstado.toLowerCase() === 'completamente realizada';
  }
}
