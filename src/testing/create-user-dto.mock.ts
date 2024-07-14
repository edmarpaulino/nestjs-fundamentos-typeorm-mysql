import { Role } from '../enums/role.enum'
import { CreateUserDTO } from '../user/dto/create-user.dto'

export const createUserDTO: CreateUserDTO = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: Role.Admin,
  birthAt: 'any_birth_at'
}
