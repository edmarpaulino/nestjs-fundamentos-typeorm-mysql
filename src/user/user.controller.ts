import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdatePutUserDTO } from './dto/update-put-user.dto'
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto'
import { UserService } from './user.service'
import { ThrottlerGuard } from '@nestjs/throttler'
import { Role } from '../enums/role.enum'
import { AuthGuard } from '../guards/auth/auth.guard'
import { RoleGuard } from '../guards/role/role.guard'
import { Roles } from '../decorators/role/role.decorator'
import { ParamId } from '../decorators/param-id/param-id.decorator'

@Roles(Role.Admin)
@UseGuards(ThrottlerGuard, AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data)
  }

  @Roles(Role.Admin)
  @Get()
  async list() {
    return this.userService.list()
  }

  @Get(':id')
  async show(@ParamId() id: number) {
    return this.userService.show(id)
  }

  @Put(':id')
  async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
    return this.userService.update(id, data)
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
    return this.userService.updatePartial(id, data)
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return { success: await this.userService.delete(id) }
  }
}
