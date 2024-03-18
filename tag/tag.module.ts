import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
//depencency injection (splitting the application into modules )
@Module({
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
