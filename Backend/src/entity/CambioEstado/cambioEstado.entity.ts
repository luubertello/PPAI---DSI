import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estado } from '../Estado/estado.entity';
import { Sismografo } from '../Sismografo/sismografo.entity';
import { Empleado } from '../Empleado/empleado.entity';

@Entity('cambio_estado')
export class CambioEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fechaHoraInicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaHoraFin: Date | null;

  // Relaciones
  @ManyToOne(() => Estado, (estado) => estado.cambios, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @ManyToOne(() => Sismografo, (s) => s.cambiosDeEstado)
  @JoinColumn({ name: 'sismografo_id' })
  sismografo: Sismografo;

  @ManyToOne(() => Empleado, { eager: true })
  @JoinColumn({ name: 'empleado_responsable_id' })
  empleadoResponsable: Empleado;

  // Métodos propios
  esActual(): boolean {
    return this.fechaHoraFin === null;
  }

  setFechaHoraFin(fecha: Date) {
    this.fechaHoraFin = fecha;
  }
}
