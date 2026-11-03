import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { CurrentUser, RequirePermission } from '../../auth/decorators/decorators';
import type { AuthenticatedUser } from '../../auth/dto/authenticated-user.dto';
import { Permission } from '../../role/enums/permission.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { ListUsersQueryDto } from '../dto/list-users-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import type { UserResponseDto } from '../dto/user-response.dto';
import { toUserResponse } from '../mappers/user-response.mapper';
import { UserAccountService } from '../services/user-account.service';
import { UserRegistrationService } from '../services/user-registration.service';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly userAccountService: UserAccountService,
    private readonly registrationService: UserRegistrationService,
  ) {}

  @Get()
  @RequirePermission(Permission.USER_MANAGE)
  public async list(@Query() filters: ListUsersQueryDto): Promise<UserResponseDto[]> {
    return (await this.userService.list(filters)).map(toUserResponse);
  }

  @Get(':id')
  @RequirePermission(Permission.USER_MANAGE)
  public async get(@Param('id', ParseIdPipe) id: string): Promise<UserResponseDto> {
    return toUserResponse(await this.userService.getDetails(id));
  }

  @Post()
  @RequirePermission(Permission.USER_MANAGE)
  public async create(@Body() input: CreateUserDto): Promise<UserResponseDto> {
    return toUserResponse(await this.registrationService.create(input.roleId, input));
  }

  @Patch(':id')
  @RequirePermission(Permission.USER_MANAGE)
  public async update(
    @Param('id', ParseIdPipe) id: string,
    @Body() input: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return toUserResponse(await this.userService.update(id, input));
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission(Permission.USER_MANAGE)
  public remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseIdPipe) id: string,
  ): Promise<void> {
    return this.userAccountService.remove(actor.id, id);
  }

  @Patch(':id/activate')
  @RequirePermission(Permission.USER_MANAGE)
  public async activate(@Param('id', ParseIdPipe) id: string): Promise<UserResponseDto> {
    return toUserResponse(await this.userAccountService.activate(id));
  }

  @Patch(':id/deactivate')
  @RequirePermission(Permission.USER_MANAGE)
  public async deactivate(@Param('id', ParseIdPipe) id: string): Promise<UserResponseDto> {
    return toUserResponse(await this.userAccountService.deactivate(id));
  }
}
