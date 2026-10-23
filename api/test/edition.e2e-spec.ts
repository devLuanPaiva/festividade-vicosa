import { UnauthorizedException, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from '../src/resources/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/resources/auth/guards/permissions.guard';
import { AuthenticationService } from '../src/resources/auth/services/authentication.service';
import { EditionController } from '../src/resources/edition/controllers/edition.controller';
import { EditionService } from '../src/resources/edition/services/edition.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { SubEventController } from '../src/resources/sub-event/controllers/sub-event.controller';
import { SubEventType } from '../src/resources/sub-event/enums/sub-event-type.enum';
import { SubEventService } from '../src/resources/sub-event/services/sub-event.service';

const users: Record<string, AuthenticatedUser> = {
  'manager-token': {
    id: 1,
    name: 'Manager',
    email: 'manager@example.com',
    permissions: [Permission.SCHEDULE_MANAGE],
  },
  'assistant-token': { id: 2, name: 'Assistant', email: 'assistant@example.com', permissions: [] },
};

const edition = { id: 1, year: 2026, name: 'Festividade 2026', description: null };
const subEvent = {
  id: 4,
  editionId: 1,
  type: SubEventType.ECOPEDAL,
  name: 'Ecopedal',
  description: null,
  startDate: '2026-12-20',
  endDate: '2026-12-20',
  location: null,
};
const validSubEvent = {
  type: SubEventType.ECOPEDAL,
  name: 'Ecopedal',
  startDate: '2026-12-20',
  endDate: '2026-12-20',
};

const editionService = {
  list: jest.fn(),
  findByIdOrFail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
const subEventService = {
  listByEdition: jest.fn(),
  findByIdOrFail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

function authenticate(token: string): Promise<AuthenticatedUser> {
  const user = users[token];
  return user ? Promise.resolve(user) : Promise.reject(new UnauthorizedException());
}

async function createApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    controllers: [EditionController, SubEventController],
    providers: [
      { provide: EditionService, useValue: editionService },
      { provide: SubEventService, useValue: subEventService },
      { provide: AuthenticationService, useValue: { authenticate } },
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionsGuard },
    ],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app, 'http://localhost:3001');
  return app.init();
}

describe('Editions and sub-events (e2e)', () => {
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
    editionService.list.mockResolvedValue([edition]);
    editionService.findByIdOrFail.mockResolvedValue(edition);
    editionService.create.mockResolvedValue(edition);
    subEventService.listByEdition.mockResolvedValue([subEvent]);
    subEventService.findByIdOrFail.mockResolvedValue(subEvent);
    subEventService.create.mockResolvedValue(subEvent);
  });

  it('lets a visitor list editions without logging in', async () => {
    const response = await request(server()).get('/editions');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'success', count: 1, results: [edition] });
  });

  it('lets a visitor list the sub-events of an edition', async () => {
    const response = await request(server()).get('/editions/1/sub-events');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ results: [subEvent] });
  });

  it('lets a visitor read one sub-event', async () => {
    const response = await request(server()).get('/sub-events/4');

    expect(response.body).toEqual({ status: 'success', result: subEvent });
  });

  it('requires login to create an edition', async () => {
    const response = await request(server()).post('/editions').send({ year: 2027, name: 'X' });

    expect(response.status).toBe(401);
  });

  it('forbids creating an edition without the schedule permission', async () => {
    const response = await request(server())
      .post('/editions')
      .set('Authorization', 'Bearer assistant-token')
      .send({ year: 2027, name: 'Festividade 2027' });

    expect(response.status).toBe(403);
  });

  it('creates an edition with a valid body', async () => {
    const response = await asManager(
      request(server()).post('/editions').send({ year: 2027, name: 'Festividade 2027' }),
    );

    expect(response.status).toBe(201);
  });

  it.each([
    { scenario: 'the year is out of range', body: { year: 1900, name: 'X' }, field: 'year' },
    { scenario: 'the name is empty', body: { year: 2027, name: '' }, field: 'name' },
    { scenario: 'the year is not a number', body: { year: 'abc', name: 'X' }, field: 'year' },
  ])('rejects an edition when $scenario', async ({ body, field }) => {
    const response = await asManager(request(server()).post('/editions').send(body));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { code: 'VALIDATION_ERROR', field } });
  });

  it.each([
    {
      scenario: 'the date has the wrong format',
      body: { ...validSubEvent, startDate: '20/12/2026' },
      field: 'startDate',
    },
    { scenario: 'the type is unknown', body: { ...validSubEvent, type: 'PARADE' }, field: 'type' },
  ])('rejects a sub-event when $scenario', async ({ body, field }) => {
    const response = await asManager(request(server()).post('/editions/1/sub-events').send(body));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field } });
  });

  it('creates a sub-event inside the edition of the url', async () => {
    const response = await asManager(
      request(server()).post('/editions/1/sub-events').send(validSubEvent),
    );

    expect(response.status).toBe(201);
    expect(subEventService.create).toHaveBeenCalledWith(1, validSubEvent);
  });

  it('does not allow changing the type of a sub-event', async () => {
    const response = await asManager(
      request(server()).patch('/sub-events/4').send({ type: SubEventType.JOCEV_FUTSAL }),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field: 'type' } });
  });
});
