import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { CambioEstado } from './CambioEstado';
import { Estado } from '../Estado/estado.entity';
import { MotivoTipo } from '../MotivoTipo/motivoTipo.entity';
import { Empleado } from '../Empleado/empleado.entity';
import { EstacionSismologica } from './EstacionSismologica';


@Entity('sismografo')
export class Sismografo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaAdquisicion: Date;

  @Column({ type: 'varchar', length: 100 })
  identificadorSismografo: string;

  @Column({ type: 'int' })
  nroSerie: number;

  @OneToMany(() => CambioEstado, cambio => cambio.sismografo)
  cambiosDeEstado: CambioEstado[];

  @OneToMany(() => EstacionSismologica, es => es.sismografo)
  estaciones: EstacionSismologica[];


  // Estado constante para fuera de servicio
  estadoFueraDeServicio: Estado = new Estado('S', 'FueraDeServicio');

constructor(
  fechaAdquisicion?: Date,
  identificadorSismografo?: string,
  nroSerie?: number,
) {
  if (fechaAdquisicion) this.fechaAdquisicion = fechaAdquisicion;
  if (identificadorSismografo) this.identificadorSismografo = identificadorSismografo;
  if (nroSerie) this.nroSerie = nroSerie;
}

// Metodos
  buscarUltimoCambioEstado(
    estadoFueraDeServicio: Estado,
    motivosSeleccionados: MotivoTipo[],
    fechaHoraActual: Date,
    responsable: Empleado,
  ): void {
    for (const cambio of this.cambiosDeEstado) {
      if (cambio.esEstadoActual()) {
        cambio.estado = estadoFueraDeServicio; // setEstado()
        cambio.motivos = motivosSeleccionados; //setMotivoTipo()
        cambio.fechaHoraFin = fechaHoraActual; // setFechaHoraFin()
        cambio.empleadoResponsable = responsable; // setEmpleadoResponsable()
        break;
      }
    }
  }

  enviarAReparar(
    motivosSeleccionados: MotivoTipo[],
    fechaHoraActual: Date,
    responsable: Empleado,
  ): void {
    this.buscarUltimoCambioEstado(
      this.estadoFueraDeServicio,
      motivosSeleccionados,
      fechaHoraActual,
      responsable,
    );
  }
}