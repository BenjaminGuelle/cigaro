import { Test, TestingModule } from '@nestjs/testing';
import { TastingsController } from './tastings.controller';

describe('TastingsController', () => {
  let controller: TastingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TastingsController],
    }).compile();

    controller = module.get<TastingsController>(TastingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
