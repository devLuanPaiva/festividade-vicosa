import type { INestApplication } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import type { App } from 'supertest/types';
import { UPLOAD_THROTTLE_OPTIONS } from '../src/storage/upload/image-upload';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { GalleryController } from '../src/resources/gallery/controllers/gallery.controller';
import { PhotoController } from '../src/resources/gallery/controllers/photo.controller';
import { GalleryService } from '../src/resources/gallery/services/gallery.service';
import { PhotoManagementService } from '../src/resources/gallery/services/photo-management.service';
import { PhotoUploadService } from '../src/resources/gallery/services/photo-upload.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { createE2eModuleApp } from './support/e2e-app';

const SUB_EVENT_ID = '00000000-0000-4000-8000-0000000000e1';
const PHOTO_ID = '00000000-0000-4000-8000-0000000000c1';
const PHOTOS_PATH = `/sub-events/${SUB_EVENT_ID}/photos`;

const users: Record<string, AuthenticatedUser> = {
  'uploader-token': {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Uploader',
    email: 'uploader@example.com',
    permissions: [Permission.PHOTO_UPLOAD],
  },
  'curator-token': {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Curator',
    email: 'curator@example.com',
    permissions: [Permission.PHOTO_UPLOAD, Permission.PHOTO_DELETE],
  },
};

const storedPhoto = {
  id: PHOTO_ID,
  subEventId: '00000000-0000-4000-8000-0000000000e1',
  storageKey: 'sub-events/jocev-futsal/photo-aaaaaaaaaaaaaaaaaaaaaaaa.webp',
  sortOrder: 0,
  createdAt: new Date('2026-12-09T18:00:00Z'),
};

const galleryService = { listPhotos: jest.fn() };
const photoUploadService = { addToSubEvent: jest.fn() };
const photoManagementService = { remove: jest.fn(), reorder: jest.fn() };

interface ErrorBody {
  errors: { code: string; field: string };
}

describe('Gallery (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const as = (token: string, call: request.Test): request.Test =>
    call.set('Authorization', `Bearer ${token}`);

  beforeAll(async () => {
    app = await createE2eModuleApp(
      {
        controllers: [GalleryController, PhotoController],
        providers: [
          { provide: GalleryService, useValue: galleryService },
          { provide: PhotoUploadService, useValue: photoUploadService },
          { provide: PhotoManagementService, useValue: photoManagementService },
        ],
        imports: [ThrottlerModule.forRoot(UPLOAD_THROTTLE_OPTIONS)],
      },
      users,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    galleryService.listPhotos.mockResolvedValue([storedPhoto]);
    photoUploadService.addToSubEvent.mockResolvedValue(storedPhoto);
    photoManagementService.reorder.mockResolvedValue([storedPhoto]);
  });

  it('shows the photos of a sub-event to visitors without login', async () => {
    const response = await request(server()).get(PHOTOS_PATH);

    expect(response.status).toBe(200);
    expect(galleryService.listPhotos).toHaveBeenCalledWith(SUB_EVENT_ID);
  });

  it('requires login to upload a photo', async () => {
    const response = await request(server())
      .post(PHOTOS_PATH)
      .attach('file', Buffer.from('image'), 'a.jpg');

    expect(response.status).toBe(401);
    expect(photoUploadService.addToSubEvent).not.toHaveBeenCalled();
  });

  it('uploads a photo as the logged user', async () => {
    const response = await as(
      'uploader-token',
      request(server()).post(PHOTOS_PATH).attach('file', Buffer.from('image'), 'a.jpg'),
    );

    expect(response.status).toBe(201);
    expect(photoUploadService.addToSubEvent).toHaveBeenCalledWith(SUB_EVENT_ID, {
      file: Buffer.from('image'),
      uploadedById: users['uploader-token']?.id,
    });
  });

  it('asks for the file when the upload has none', async () => {
    const response = await as('uploader-token', request(server()).post(PHOTOS_PATH));

    expect(response.status).toBe(400);
    expect((response.body as ErrorBody).errors).toMatchObject({ code: 'FILE_REQUIRED' });
  });

  it('keeps delete and reorder away from who can only upload', async () => {
    const removal = await as('uploader-token', request(server()).delete(`/photos/${PHOTO_ID}`));
    const reorder = await as(
      'uploader-token',
      request(server())
        .put('/photos/order')
        .send({ photoIds: [PHOTO_ID] }),
    );

    expect([removal.status, reorder.status]).toEqual([403, 403]);
    expect(photoManagementService.remove).not.toHaveBeenCalled();
    expect(photoManagementService.reorder).not.toHaveBeenCalled();
  });

  it('lets who can delete remove and reorder photos', async () => {
    const removal = await as('curator-token', request(server()).delete(`/photos/${PHOTO_ID}`));
    const reorder = await as(
      'curator-token',
      request(server())
        .put('/photos/order')
        .send({ photoIds: [PHOTO_ID] }),
    );

    expect([removal.status, reorder.status]).toEqual([204, 200]);
  });

  it('refuses a reorder that is not a list of photo ids', async () => {
    const response = await as(
      'curator-token',
      request(server())
        .put('/photos/order')
        .send({ photoIds: ['not-an-id'] }),
    );

    expect(response.status).toBe(400);
    expect((response.body as ErrorBody).errors).toMatchObject({ field: 'photoIds' });
  });
});
