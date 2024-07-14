import { Test, TestingModule } from '@nestjs/testing'
import { FileService } from './file.service'
import { getPhoto } from '../testing/get-photo.mock'

describe('FileService', () => {
  let fileService: FileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService]
    }).compile()

    fileService = module.get<FileService>(FileService)
  })

  it('Should validate the definition', async () => {
    expect(fileService).toBeDefined()
  })

  test('upload method', async () => {
    const photo = await getPhoto()
    const filename = 'photo-test.jpeg'

    fileService.upload(photo, filename)
  })
})
