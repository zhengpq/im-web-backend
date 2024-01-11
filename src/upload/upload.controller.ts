import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/public';
import { UploadService } from './upload.service';

const imageMaxSize = 1024 * 1024 * 10;

const imagePipeBuilder = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /(jpg|jpeg|png|webp)$/,
  })
  .addMaxSizeValidator({
    maxSize: imageMaxSize,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post('/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile(imagePipeBuilder) file: Express.Multer.File) {
    const result = await this.uploadService.uploadImage(file);
    return result;
  }
}
