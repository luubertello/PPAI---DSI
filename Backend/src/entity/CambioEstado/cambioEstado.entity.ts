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
import { MotivoFueraServicio } from '../MotivoFueraServicio/motivoFueraServicio.entity';

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

  @ManyToOne(() => MotivoFueraServicio, { nullable: true })
  motivoFueraServicio: MotivoFueraServicio;

  // Métodos propios
  esActual(): boolean {
    return !this.fechaHoraFin;
  }

  setFechaHoraFin(fecha: Date) {
    this.fechaHoraFin = fecha;
  }
}
