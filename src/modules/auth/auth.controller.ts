import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/create-user.dto';
import { TrackFeature } from '../analytics/decorators/track-feature.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @TrackFeature({
    featureName: 'user',
    action: "login_user",
    includeMetadata: true
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }
}
