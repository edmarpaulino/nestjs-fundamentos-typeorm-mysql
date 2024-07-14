import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthRegisterDTO } from './dto/auth-register.dto'
import { compare, genSalt, hash } from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { UserEntity } from '../user/entity/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: 'login',
          audience: 'users'
        }
      )
    }
  }

  checkToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'login'
      })
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token)
      return true
    } catch (e) {
      return false
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email })

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Email e/ou senha incorretos.')
    }

    return this.createToken(user)
  }

  async forget(email: string) {
    const user = await this.usersRepository.findOneBy({ email })

    if (!user) {
      throw new UnauthorizedException('Email está incorreto')
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users'
      }
    )

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: user.email,
      template: 'forget',
      context: {
        name: user.name,
        token
      }
    })

    return true
  }

  async reset(password: string, token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users'
      })

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('token inválido')
      }

      const salt = await genSalt()

      const hashedPassword = await hash(password, salt)

      await this.usersRepository.update(data.id, {
        password: hashedPassword
      })

      const user = await this.userService.show(data.id)

      return this.createToken(user)
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async register(data: AuthRegisterDTO) {
    delete data.role

    const user = await this.userService.create(data)

    return this.createToken(user)
  }
}
