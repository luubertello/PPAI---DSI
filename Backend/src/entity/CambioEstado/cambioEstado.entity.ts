import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estado } from '../Estado/estado.entity';
import { Sismografo } from '../Sismografo/sismografo.entity';

@Entity('cambio_estado')
export class CambioEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fechaHoraInicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaHoraFin: Date | null;

  // 🔹 Relación con Estado
  @ManyToOne(() => Estado, (estado) => estado.cambios, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  // 🔹 Relación con Sismógrafo
  @ManyToOne(() => Sismografo, (s) => s.cambiosDeEstado)
  @JoinColumn({ name: 'sismografo_id' })
  sismografo: Sismografo;

  // Métodos propios
  esActual(): boolean {
    return this.fechaHoraFin === null;
  }

  setFechaHoraFin(fecha: Date) {
    this.fechaHoraFin = fecha;
  }
}
