import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { TrackFeature } from '../analytics/decorators/track-feature.decorator';

@Controller('users')
export class PublicUserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @TrackFeature({ 
    featureName: 'user', 
    action: "create_user",
    includeMetadata: true 
  })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
