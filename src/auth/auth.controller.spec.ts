import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthGuard } from '../guards/auth/auth.guard'
import { guardMock } from '../testing/guard.mock'
import { authServiceMock } from '../testing/auth-service.mock'
import { fileServiceMock } from '../testing/file-service.mock'
import { authLoginDTO } from '../testing/auth-login-dto'
import { accessToken } from '../testing/access-token.mock'
import { authRegisterDTO } from '../testing/auth-register-dto.mock'
import { authForgetDTO } from '../testing/auth-forget-dto'
import { authResetDTO } from '../testing/auth-reset-dto'
import { userEntityList } from '../testing/user-entity-list.mock'
import { getPhoto } from '../testing/get-photo.mock'

describe('AuthController', () => {
  let authController: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock, fileServiceMock]
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile()

    authController = module.get<AuthController>(AuthController)
  })

  it('Should validate the definition', async () => {
    expect(authController).toBeDefined()
  })

  describe('Login', () => {
    test('login method', async () => {
      const result = await authController.login(authLoginDTO)

      expect(result).toEqual({ accessToken })
    })

    test('register method', async () => {
      const result = await authController.register(authRegisterDTO)

      expect(result).toEqual({ accessToken })
    })

    test('forget method', async () => {
      const result = await authController.forget(authForgetDTO)

      expect(result).toEqual({ success: true })
    })

    test('reset method', async () => {
      const result = await authController.reset(authResetDTO)

      expect(result).toEqual({ accessToken })
    })
  })

  describe('Authenticated', () => {
    test('me method', async () => {
      const result = await authController.me(userEntityList[0])

      expect(result).toEqual({ user: userEntityList[0] })
    })

    test('uploadPhoto method', async () => {
      const photo = await getPhoto()
      const result = await authController.uploadPhoto(userEntityList[0], photo)

      expect(result).toEqual({ success: true })
    })
  })
})
