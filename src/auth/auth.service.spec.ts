import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { userRepositoryMock } from '../testing/user-repository.mock'
import { jwtServiceMock } from '../testing/jwt-service.mock'
import { userServiceMock } from '../testing/user-service.mock'
import { mailerServiceMock } from '../testing/mailer-service.mock'
import { userEntityList } from '../testing/user-entity-list.mock'
import { accessToken } from '../testing/access-token.mock'
import { jwtPayload } from '../testing/jwt-payload.mock'
import { resetToken } from '../testing/reset-token.mock copy'
import { authRegisterDTO } from '../testing/auth-register-dto.mock'

jest.mock('bcrypt', () => ({
  compare: jest.fn(() => true),
  genSalt: jest.fn(() => 'any_salt'),
  hash: jest.fn(() => 'any_hash')
}))

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  it('Should validate the definition', async () => {
    expect(authService).toBeDefined()
  })

  describe('Token', () => {
    test('createToken method', () => {
      const result = authService.createToken(userEntityList[0])

      expect(result).toEqual({ accessToken })
    })

    test('checkToken method', () => {
      const result = authService.checkToken(accessToken)

      expect(result).toEqual(jwtPayload)
    })

    test('isValidToken method', () => {
      const result = authService.isValidToken(accessToken)

      expect(result).toEqual(true)
    })
  })

  describe('Auth', () => {
    test('login method', async () => {
      const result = await authService.login(
        'any_email@mail.com',
        'any_password'
      )

      expect(result).toEqual({ accessToken })
    })

    test('forget method', async () => {
      const result = await authService.forget('any_email@mail.com')

      expect(result).toEqual(true)
    })

    test('reset method', async () => {
      const result = await authService.reset('any_password', resetToken)

      expect(result).toEqual({ accessToken })
    })

    test('register method', async () => {
      const result = await authService.register(authRegisterDTO)

      expect(result).toEqual({ accessToken })
    })
  })
})
