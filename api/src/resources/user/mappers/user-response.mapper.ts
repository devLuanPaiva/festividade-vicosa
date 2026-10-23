import type { UserResponseDto } from '../dto/user-response.dto';
import type { User } from '../entities/user.entity';

export function toUserResponse(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    active: user.active,
    roleCode: user.role.code,
    createdAt: user.createdAt,
  };
}
