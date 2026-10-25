import { UnauthorizedException, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from '../src/resources/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/resources/auth/guards/permissions.guard';
import { AuthenticationService } from '../src/resources/auth/services/authentication.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { TeamPhotoController } from '../src/resources/team/controllers/team-photo.controller';
import { TeamPhotoService } from '../src/resources/team/services/team-photo.service';
import { UPLOAD_THROTTLE_OPTIONS } from '../src/storage/upload/image-upload';

const TEAM_ID = '00000000-0000-4000-8000-000000000007';
const PHOTO_PATH = `/teams/${TEAM_ID}/photo`;
const TEN_MEGABYTES = 10 * 1024 * 1024;

const users: Record<string, AuthenticatedUser> = {
  'manager-token': {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Manager',
    email: 'manager@example.com',
    permissions: [Permission.TEAM_MANAGE],
  },
  'assistant-token': {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Assistant',
    email: 'assistant@example.com',
    permissions: [],
  },
};

const team = {
  id: TEAM_ID,
  categoryId: '00000000-0000-4000-8000-000000000005',
  groupId: null,
  name: 'Centro',
  slug: 'centro',
  city: 'Viçosa',
  abbreviation: null,
  photoKey: `teams/${TEAM_ID}/team-0123456789abcdef01234567`,
};

const teamPhotoService = { replace: jest.fn(), remove: jest.fn() };

interface ResponseBody {
  result: { id: string; photoKey: string | null };
  errors: { code: string; field: string; detail: string };
}

function bodyOf(response: request.Response): ResponseBody {
  return response.body as ResponseBody;
}

function authenticate(token: string): Promise<AuthenticatedUser> {
  const user = users[token];
  return user ? Promise.resolve(user) : Promise.reject(new UnauthorizedException());
}

async function createApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [ThrottlerModule.forRoot(UPLOAD_THROTTLE_OPTIONS)],
    controllers: [TeamPhotoController],
    providers: [
      { provide: TeamPhotoService, useValue: teamPhotoService },
      { provide: AuthenticationService, useValue: { authenticate } },
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionsGuard },
    ],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app, 'http://localhost:3001');
  return app.init();
}

describe('Team photo (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const asManager = (call: request.Test): request.Test =>
    call.set('Authorization', 'Bearer manager-token');

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    teamPhotoService.replace.mockResolvedValue(team);
    teamPhotoService.remove.mockResolvedValue({ ...team, photoKey: null });
  });

  it('forbids changing the photo without the team permission', async () => {
    const response = await request(server())
      .put(PHOTO_PATH)
      .set('Authorization', 'Bearer assistant-token')
      .attach('file', Buffer.from('image'), 'photo.jpg');

    expect(response.status).toBe(403);
    expect(teamPhotoService.replace).not.toHaveBeenCalled();
  });

  it('asks for the file when the request has none', async () => {
    const response = await asManager(request(server()).put(PHOTO_PATH));

    expect(response.status).toBe(400);
    expect(bodyOf(response).errors).toMatchObject({ code: 'FILE_REQUIRED', field: 'file' });
  });

  it('hands the bytes of the file to the service and answers with the team', async () => {
    const response = await asManager(
      request(server()).put(PHOTO_PATH).attach('file', Buffer.from('image-bytes'), 'IMG_0001.jpg'),
    );

    expect(response.status).toBe(200);
    expect(bodyOf(response).result).toMatchObject({ id: TEAM_ID, photoKey: team.photoKey });
    expect(teamPhotoService.replace).toHaveBeenCalledWith(TEAM_ID, Buffer.from('image-bytes'));
  });

  it('refuses a file above 10 MB with a message in portuguese', async () => {
    const response = await asManager(
      request(server())
        .put(PHOTO_PATH)
        .attach('file', Buffer.alloc(TEN_MEGABYTES + 1), 'huge.jpg'),
    );

    expect(response.status).toBe(413);
    expect(bodyOf(response).errors).toMatchObject({
      code: 'PAYLOAD_TOO_LARGE',
      detail: 'O arquivo enviado é grande demais. O limite é de 10 MB.',
    });
    expect(teamPhotoService.replace).not.toHaveBeenCalled();
  });

  it('removes the photo and answers with the team without it', async () => {
    const response = await asManager(request(server()).delete(PHOTO_PATH));

    expect(response.status).toBe(200);
    expect(bodyOf(response).result.photoKey).toBeNull();
  });
});
