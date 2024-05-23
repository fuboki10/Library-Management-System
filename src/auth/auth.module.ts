import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './auth-basic.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [PassportModule, ConfigModule, UsersModule],
  providers: [BasicStrategy],
})
export class AuthModule {}
