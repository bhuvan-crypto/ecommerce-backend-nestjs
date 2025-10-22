import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
@Auth()
@Controller('users')
export class PrivateUserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
