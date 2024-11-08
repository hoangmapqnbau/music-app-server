import { UsersService } from './../users/users.service';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Get token from the cookie instead of the Authorization header
    const authHeader  = req.headers?.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }      
      
      req.user = user; 

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
