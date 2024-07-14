import { Role } from '../enums/role.enum'
import { UpdatePatchUserDTO } from '../user/dto/update-patch-user.dto'

export const updatePatchUserDTO: UpdatePatchUserDTO = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: Role.Admin,
  birthAt: 'any_birth_at'
}
