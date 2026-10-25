import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { imageUploadInterceptor, ONE_MINUTE_IN_MILLISECONDS } from './image-upload';

const UPLOAD_ENDPOINT_LIMIT = 20;

export const ImageUploadEndpoint = (): MethodDecorator =>
  applyDecorators(
    UseGuards(ThrottlerGuard),
    Throttle({ default: { limit: UPLOAD_ENDPOINT_LIMIT, ttl: ONE_MINUTE_IN_MILLISECONDS } }),
    UseInterceptors(imageUploadInterceptor),
  );
