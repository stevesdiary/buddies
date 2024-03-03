import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
//depencency injection (splitting the application into modules )
@Module({
   controllers: [TagController]
})
export class TagModule {}