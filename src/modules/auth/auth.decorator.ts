import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), ApiBearerAuth());
}
