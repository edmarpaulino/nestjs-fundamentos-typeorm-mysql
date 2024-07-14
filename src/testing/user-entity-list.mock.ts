import { Role } from '../enums/role.enum'
import { UserEntity } from '../user/entity/user.entity'

export const userEntityList: UserEntity[] = [
  {
    id: 1,
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: Role.Admin,
    birthAt: new Date(2024, 1, 1),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'other_name',
    email: 'other_email@mail.com',
    password: 'other_password',
    role: Role.User,
    birthAt: new Date(2022, 3, 7),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'another_name',
    email: 'another_email@mail.com',
    password: 'another_password',
    role: Role.User,
    birthAt: new Date(2023, 11, 13),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
