import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sismografo } from './sismografo.entity';
import { CambioEstado } from '../CambioEstado/cambioEstado.entity';
import { Estado } from '../Estado/estado.entity';
import { CambioEstadoService } from '../CambioEstado/cambioEstado.service';

@Injectable()
export class SismografoService {
  constructor(
    @InjectRepository(Sismografo)
    private readonly sismografoRepo: Repository<Sismografo>,

    @InjectRepository(CambioEstado)
    private readonly cambioEstadoRepo: Repository<CambioEstado>,

    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,

  private readonly cambioEstadoService: CambioEstadoService
  ) {}

//Metodo buscarUltimoCambioEstado
async buscarUltimoCambioEstado(sismografoId: number): Promise<CambioEstado | null> {
  const sismografo = await this.sismografoRepo.findOne({
    where: { id: sismografoId },
    relations: ['cambiosEstado'], // relación con CambioEstado
  });

  if (!sismografo) {
    throw new Error('Sismógrafo no encontrado');
  }

  // Busca el cambio de estado que sea actual
  const ultimoCambio = sismografo.cambiosDeEstado.find((cambio) => cambio.esActual());

  return ultimoCambio || null;
}

async enviarAReparar(sismografoId: number): Promise<void> {
  const ultimoCambio = await this.buscarUltimoCambioEstado(sismografoId);

  if (!ultimoCambio) {
    throw new Error('No existe un cambio de estado actual para este sismógrafo');
  }

  // Cerrar el cambio actual
  ultimoCambio.fechaHoraFin = new Date();
  await this.cambioEstadoRepo.save(ultimoCambio);

  // Obtener estado "Fuera de servicio"
  const estadoFueraServicio = await this.estadoRepo.findOne({
    where: { nombreEstado: 'Fuera de servicio' },
  });

  if (!estadoFueraServicio) {
    throw new Error('Estado "Fuera de servicio" no existe');
  }

  const sismografo = await this.sismografoRepo.findOne({
    where: { id: sismografoId },
  });

  if (!sismografo) {
    throw new Error('Sismógrafo no encontrado');
  }

  // Creamos cambio de estado
  await this.cambioEstadoService.crearCambioEstado(sismografo, estadoFueraServicio);
}

  async solicitarCertificacion(sismografoId: number): Promise<void> {
    // Logica
  }
}
