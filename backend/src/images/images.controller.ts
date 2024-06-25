import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';

@Controller('image')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}
  @Get('resize')
  async getResizedImage(@Query('url') url: string, @Res() res: Response) {
    try {
      const imageBuffer = await this.imageService.resizeImage(url);
      res.set('Content-Type', 'image/png');
      res.send(imageBuffer);
    } catch (err) {
      throw new HttpException(
        'Failed to resize image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
