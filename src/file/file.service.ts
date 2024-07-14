import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { writeFile } from 'fs'
import { join } from 'path'

@Injectable()
export class FileService {
  getDestinationPath(): string {
    return join(__dirname, '..', '..', 'storage', 'photos')
  }

  async upload(file: Express.Multer.File, filename: string) {
    writeFile(join(this.getDestinationPath(), filename), file.buffer, (err) => {
      if (err) {
        throw new InternalServerErrorException(err)
      }
    })

    return { success: true }
  }
}
