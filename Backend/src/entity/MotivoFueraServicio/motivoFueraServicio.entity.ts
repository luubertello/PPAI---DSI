import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MotivoTipo } from '../MotivoTipo/motivoTipo.entity';

@Entity('motivo_fuera_servicio')
export class MotivoFueraServicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  comentario: string;

  @ManyToOne(() => MotivoTipo, (tipo) => tipo.motivos, { eager: true })
  @JoinColumn({ name: 'tipo_id' })
  tipo: MotivoTipo;
}

