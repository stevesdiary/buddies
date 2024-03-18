import { Injectable } from '@nestjs/common';

//in service, we keep all the business logic here
@Injectable()
export class TagService {
  findAll(): string[] {
    return ['dragons', 'coffee', 'weather', 'sport'];
  }
}
