import * as cloudinary from 'cloudinary'
import { Request, Response } from 'express'
import { HttpError } from '../middlewares/error'

async function uploadImages(images: Express.Multer.File[]) {
  try {
    return await Promise.all(
      images.map((image) =>
        cloudinary.v2.uploader.upload(
          `data:${image.mimetype};base64,${image.buffer.toString('base64')}`,
          {
            width: 1000,
            height: 1000,
            crop: 'limit',
            format: 'jpg',
          },
        ),
      ),
    )
  } catch (e) {
    console.error(e)
    throw new HttpError(500, 'Image Upload Failed')
  }
}

export default async function uploadImage(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError(401, 'Authorization Required')
  }

  if (
    (req.files as Express.Multer.File[]).some(
      ({ mimetype }) => !/^image\/.*$/.test(mimetype),
    )
  ) {
    throw new HttpError(400, 'Not Supported File Type')
  }

  const results = await uploadImages(req.files as Express.Multer.File[])

  res.send({
    images: results.map(({ public_id: cloudinaryId, url, width, height }) => ({
      cloudinaryId,
      url,
      width,
      height,
    })),
  })
}
