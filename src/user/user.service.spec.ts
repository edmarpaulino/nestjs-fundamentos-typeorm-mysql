import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { userRepositoryMock } from '../testing/user-repository.mock'
import { userEntityList } from '../testing/user-entity-list.mock'
import { createUserDTO } from '../testing/create-user-dto.mock'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserEntity } from './entity/user.entity'
import { updatePutUserDTO } from '../testing/update-put-user-dto.mock'
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock'

describe('UserService', () => {
  let userService: UserService
  let userRepository: any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock]
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get(getRepositoryToken(UserEntity))
  })

  it('Should validate the definition', async () => {
    expect(userService).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('Create', () => {
    test('create method', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false)
      const result = await userService.create(createUserDTO)

      expect(result).toEqual(userEntityList[0])
    })
  })

  describe('Read', () => {
    test('list method', async () => {
      const result = await userService.list()

      expect(result).toEqual(userEntityList)
    })

    test('show method', async () => {
      const result = await userService.show(1)

      expect(result).toEqual(userEntityList[0])
    })
  })

  describe('Update', () => {
    test('update method', async () => {
      const result = await userService.update(1, updatePutUserDTO)

      expect(result).toEqual(userEntityList[0])
    })

    test('updatePartial method', async () => {
      const result = await userService.updatePartial(1, updatePatchUserDTO)

      expect(result).toEqual(userEntityList[0])
    })
  })

  describe('Delete', () => {
    test('delete method', async () => {
      const result = await userService.delete(1)

      expect(result).toBe(true)
    })
  })
})
