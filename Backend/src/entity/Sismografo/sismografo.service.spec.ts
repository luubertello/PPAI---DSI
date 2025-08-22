import { Test, TestingModule } from '@nestjs/testing';
import { SismografoService } from './sismografo.service';

describe('SismografoService', () => {
  let service: SismografoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SismografoService],
    }).compile();

    service = module.get<SismografoService>(SismografoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
