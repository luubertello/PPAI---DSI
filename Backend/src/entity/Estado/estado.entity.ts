import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrdenInspeccion } from '../OrdenInspeccion/OrdenInspeccion.entity';
import { CambioEstado } from '../CambioEstado/cambioEstado.entity';
@Entity('estado')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  ambito: string;

  @Column({ type: 'varchar', length: 100 })
  nombreEstado: string;

  @OneToMany(() => OrdenInspeccion, orden => orden.estado)
  ordenes: OrdenInspeccion[];

  @OneToMany(() => CambioEstado, cambio => cambio.estado)
    cambiosDeEstado: CambioEstado[];


  constructor(ambito?: string, nombreEstado?: string) {
    if (ambito) this.ambito = ambito;
    if (nombreEstado) this.nombreEstado = nombreEstado;
  }

  esAmbitoOI(): boolean {
    return this.ambito?.toLowerCase() === 'oi';
  }

  esCerrada(): boolean {
    return this.nombreEstado?.toLowerCase() === 'cerrada';
  }

  esCompRealizada(): boolean {
    return this.nombreEstado?.toLowerCase() === 'completamenterealizada';
  }
}
