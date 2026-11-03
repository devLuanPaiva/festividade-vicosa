export interface UserRoleResponseDto {
  id: string;
  name: string;
  primary: boolean;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  active: boolean;
  roles: UserRoleResponseDto[];
  createdAt: Date;
}
