import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { RefreshSessionService } from './services/refresh-session.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshSessionService, RefreshTokenRepository],
  exports: [RefreshSessionService],
})
export class SessionModule {}
