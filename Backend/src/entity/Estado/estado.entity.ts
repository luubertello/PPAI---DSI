import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { CambioEstado } from '../CambioEstado/cambioEstado.entity';
import { OrdenInspeccion } from '../OrdenInspeccion/OrdenInspeccion.entity';

@Entity('estado')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombreEstado: string;

  @Column({ type: 'varchar', length: 50 })
  ambito: string; // sismografo, 

  @OneToMany(() => CambioEstado, (cambio) => cambio.estado)
  cambios: CambioEstado[];

  @OneToMany(() => OrdenInspeccion, (orden) => orden.estado)
  ordenes: OrdenInspeccion[];

  // Métodos
  esAmbitoSismografo(): boolean {
    return this.ambito.toLowerCase() === 'sismografo';
  }

  esCerrada(): boolean {
    return this.nombreEstado.toLowerCase() === 'cerrada';
  }

  esFueraDeServicio(): boolean {
    return this.nombreEstado.toLowerCase() === 'fuera de servicio';
  }
}
