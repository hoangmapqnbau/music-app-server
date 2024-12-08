import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { SECURE_KEY } from 'src/constant/constant';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: SECURE_KEY,
      signOptions: { expiresIn: '99999m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthModule, JwtModule],
})
export class AuthModule {}
