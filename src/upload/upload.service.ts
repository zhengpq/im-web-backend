import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import cos from 'src/utils/cos';
import uuidv4 from 'src/utils/uuid';
import { cosBucketConfig } from 'src/config/index';
import { ErrorCode, errorMessage } from 'src/const/error-code';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File) {
    const { buffer } = file;
    const fileName = `${uuidv4()}.webp`;
    const newFile = await sharp(buffer).webp({
      quality: 50,
    });
    if (newFile) {
      try {
        const cosData = await cos.putObject({
          ...cosBucketConfig,
          Key: fileName,
          Body: newFile,
        });
        return {
          url: `https://${cosData.Location}`,
        };
      } catch (error) {
        console.error(error);
        return {
          code: ErrorCode.COS_PUT_OBJECT_FAILED,
          message: errorMessage[ErrorCode.COS_PUT_OBJECT_FAILED],
          data: null,
        };
      }
    }
    return null;
  }
}
