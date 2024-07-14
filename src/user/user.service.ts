import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdatePutUserDTO } from './dto/update-put-user.dto'
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto'
import { genSalt, hash } from 'bcrypt'
import { Repository } from 'typeorm'
import { UserEntity } from './entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async create(data: CreateUserDTO) {
    if (await this.usersRepository.exists({ where: { email: data.email } })) {
      throw new BadRequestException('Este e-mail já está sendo utilizado')
    }

    const salt = await genSalt()

    data.password = await hash(data.password, salt)

    const user = await this.usersRepository.create(data)

    return this.usersRepository.save(user)
  }

  async list() {
    return this.usersRepository.find()
  }

  async show(id: number) {
    await this.exists(id)

    return this.usersRepository.findOneBy({ id })
  }

  async update(id: number, data: UpdatePutUserDTO) {
    await this.exists(id)

    const salt = await genSalt()

    data.password = await hash(data.password, salt)

    await this.usersRepository.update(id, {
      ...data,
      birthAt: data.birthAt ? new Date(data.birthAt) : null
    })

    return this.show(id)
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id)

    if (data.password) {
      const salt = await genSalt()

      data.password = await hash(data.password, salt)
    }

    await this.usersRepository.update(id, {
      ...data,
      birthAt: data.birthAt ? new Date(data.birthAt) : null
    })

    return this.show(id)
  }

  async delete(id: number) {
    await this.exists(id)

    await this.usersRepository.delete(id)

    return true
  }

  async exists(id: number) {
    if (!(await this.usersRepository.exists({ where: { id } }))) {
      throw new NotFoundException(`O usuário ${id} não existe`)
    }
  }
}
