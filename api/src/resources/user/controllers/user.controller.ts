import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/dto/authenticated-user.dto';
import { CurrentUser, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import type { UserResponseDto } from '../dto/user-response.dto';
import { toUserResponse } from '../mappers/user-response.mapper';
import { UserAccountService } from '../services/user-account.service';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly userAccountService: UserAccountService,
  ) {}

  @Get()
  @RequirePermission(Permission.USER_MANAGE)
  public async list(): Promise<UserResponseDto[]> {
    return (await this.userService.list()).map(toUserResponse);
  }

  @Post()
  @RequirePermission(Permission.USER_MANAGE)
  public async create(@Body() input: CreateUserDto): Promise<UserResponseDto> {
    return toUserResponse(await this.userService.create(input.roleCode, input));
  }

  @Patch(':id/activate')
  @RequirePermission(Permission.USER_MANAGE)
  public async activate(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return toUserResponse(await this.userAccountService.activate(id));
  }

  @Patch(':id/deactivate')
  @RequirePermission(Permission.USER_MANAGE)
  public async deactivate(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return toUserResponse(await this.userAccountService.deactivate(id));
  }

  @Patch(':id/role')
  @RequirePermission(Permission.USER_MANAGE_PERMISSIONS)
  public async changeRole(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() input: ChangeRoleDto,
  ): Promise<UserResponseDto> {
    return toUserResponse(await this.userAccountService.changeRole(actor.id, id, input.roleCode));
  }
}
