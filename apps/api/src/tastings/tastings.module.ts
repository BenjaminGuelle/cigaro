import { Module } from '@nestjs/common';
import { TastingsController } from './tastings.controller';
import { TastingsService } from './tastings.service';

@Module({
  controllers: [TastingsController],
  providers: [TastingsService],
})
export class TastingsModule {}
