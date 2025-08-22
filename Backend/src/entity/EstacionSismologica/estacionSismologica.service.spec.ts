import { Test, TestingModule } from '@nestjs/testing';
import { EstacionSismologicaService } from './estacion-sismologica.service';

describe('EstacionSismologicaService', () => {
  let service: EstacionSismologicaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstacionSismologicaService],
    }).compile();

    service = module.get<EstacionSismologicaService>(EstacionSismologicaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
