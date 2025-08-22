import { Test, TestingModule } from '@nestjs/testing';
import { MotivoTipoService } from './motivoTipo.service';

describe('MotivoTipoService', () => {
  let service: MotivoTipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MotivoTipoService],
    }).compile();

    service = module.get<MotivoTipoService>(MotivoTipoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
