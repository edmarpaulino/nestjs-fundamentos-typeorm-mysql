import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  // UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { AuthLoginDTO } from './dto/auth-login.dto'
import { AuthRegisterDTO } from './dto/auth-register.dto'
import { AuthForgetDTO } from './dto/auth-forget.dto'
import { AuthResetDTO } from './dto/auth-reset.dto'
import { AuthService } from './auth.service'
import {
  // FileFieldsInterceptor,
  FileInterceptor
  // FilesInterceptor
} from '@nestjs/platform-express'
import { AuthGuard } from '../guards/auth/auth.guard'
import { User } from '../decorators/user/user.decorator'
import { FileService } from '../file/file.service'
import { UserEntity } from '../user/entity/user.entity'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body)
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email)
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token)
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user: UserEntity) {
    return { user }
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 10 })
        ]
      })
    )
    photo: Express.Multer.File
  ) {
    const filename = `photo-${user.id}.jpeg`

    return this.fileService.upload(photo, filename)
  }

  // @UseInterceptors(FilesInterceptor('files'))
  // @UseGuards(AuthGuard)
  // @Post('files')
  // async uploadFiles(
  //   @User() user,
  //   @UploadedFiles() files: Express.Multer.File[]
  // ) {
  //   return files
  // }

  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     {
  //       name: 'photo',
  //       maxCount: 1
  //     },
  //     {
  //       name: 'documents',
  //       maxCount: 10
  //     }
  //   ])
  // )
  // @UseGuards(AuthGuard)
  // @Post('file-fields')
  // async uploadFilesFields(
  //   @User() user,
  //   @UploadedFiles()
  //   files: { photo: Express.Multer.File; documents: Express.Multer.File[] }
  // ) {
  //   return files
  // }
}
