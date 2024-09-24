import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { SECURE_KEY } from 'src/constant/constant';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: SECURE_KEY,
      signOptions: { expiresIn: '1440m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthModule],
})
export class AuthModule {}
