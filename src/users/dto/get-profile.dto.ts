import { Role } from '../schemas/role.schema';

export class GetUserDto extends Role {
  email: string;
  fullName: string;
  userId: string;
}
