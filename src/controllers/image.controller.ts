import { NextFunction, Request, Response } from "express";
import GetImageService from "../services/images/get-image.service";
import UploadImageService from "../services/images/upload-image.service";
import { ImageService } from "../services/images/image.service";
import { getResponse } from "../utils/url";

export default class ImageController {
  private getImageService: GetImageService
  private uploadImageService: UploadImageService

  constructor(getImageService: GetImageService, uploadImageService: UploadImageService) {
    this.getImageService = getImageService
    this.uploadImageService = uploadImageService
  }

  public async getImage(req: Request, res: Response, next: NextFunction) {
    try {
      const url = await this.getImageService.handle(req.params.key);
      const response = await getResponse(url);
      const buffer = await response.buffer();
      res.status(200).send(buffer)
    } catch (e) {
      next(e)
    }
  }

  public async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        const key = await this.uploadImageService.handle(req.file as Express.Multer.File)

        res.status(200).json({ key })
      } else {
        res.status(400).json({ errors: 'Image not attached' })
      }
    } catch (e) {
      next(e)
    }
  }
}
