import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
  async resizeImage(imageUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const imageBuffer = Buffer.from(response.data, 'binary');

      return await sharp(imageBuffer).resize(128, 128).png().toBuffer();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch or process image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
