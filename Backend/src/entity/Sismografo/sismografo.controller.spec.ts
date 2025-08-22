import { Test, TestingModule } from '@nestjs/testing';
import { SismografoController } from './sismografo.controller';

describe('SismografoController', () => {
  let controller: SismografoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SismografoController],
    }).compile();

    controller = module.get<SismografoController>(SismografoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
