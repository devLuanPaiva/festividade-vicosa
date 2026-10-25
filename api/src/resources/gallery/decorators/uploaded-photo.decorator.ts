import { createParamDecorator, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { requireUploadedImage } from '../../../storage/upload/image-upload';
import type { AuthenticatedRequest } from '../../auth/dto/authenticated-user.dto';
import type { PhotoUpload } from '../services/photo-store.service';

type UploadRequest = AuthenticatedRequest & { file?: Express.Multer.File };

export const UploadedPhoto = createParamDecorator(
  (_data: unknown, context: ExecutionContext): PhotoUpload => {
    const { file, user } = context.switchToHttp().getRequest<UploadRequest>();
    if (!user) {
      throw new UnauthorizedException();
    }
    return { file: requireUploadedImage(file), uploadedById: user.id };
  },
);
