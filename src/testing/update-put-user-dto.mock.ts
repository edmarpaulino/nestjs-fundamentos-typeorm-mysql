import { Role } from '../enums/role.enum'
import { UpdatePutUserDTO } from '../user/dto/update-put-user.dto'

export const updatePutUserDTO: UpdatePutUserDTO = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: Role.Admin,
  birthAt: 'any_birth_at'
}
