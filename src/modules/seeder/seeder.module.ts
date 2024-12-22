import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AUTHS_MODEL, AuthsSchema } from 'modules/auth/schemas/auths.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AUTHS_MODEL,
        schema: AuthsSchema
      },
    ])
  ],
  providers: [SeederService]
})
export class SeederModule {}
