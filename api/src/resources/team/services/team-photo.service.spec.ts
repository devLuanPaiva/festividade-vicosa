import type { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Team } from '../entities/team.entity';
import type { TeamRepository } from '../repository/team.repository';
import { TeamPhotoService } from './team-photo.service';
import type { TeamService } from './team.service';

const TEAM_ID = '00000000-0000-4000-8000-000000000007';
const OLD_KEY = `teams/${TEAM_ID}/team-aaaaaaaaaaaaaaaaaaaaaaaa`;
const NEW_KEY = `teams/${TEAM_ID}/team-bbbbbbbbbbbbbbbbbbbbbbbb`;

function createFixture(photoKey: string | null = OLD_KEY): {
  service: TeamPhotoService;
  repository: { update: jest.Mock };
  media: { upload: jest.Mock; discard: jest.Mock };
} {
  const team = { id: TEAM_ID, photoKey } as Team;
  const teamService = { findByIdOrFail: jest.fn().mockResolvedValue(team) };
  const repository = { update: jest.fn().mockResolvedValue(undefined) };
  const media = { upload: jest.fn().mockResolvedValue(NEW_KEY), discard: jest.fn() };
  const service = new TeamPhotoService(
    teamService as unknown as TeamService,
    repository as unknown as TeamRepository,
    media as unknown as MediaUploadService,
  );
  return { service, repository, media };
}

describe('TeamPhotoService.replace', () => {
  it('saves the new photo in the team folder, points the team to it and drops the old one', async () => {
    const { service, repository, media } = createFixture();

    await service.replace(TEAM_ID, Buffer.from('photo'));

    expect(media.upload).toHaveBeenCalledWith(
      { folder: 'TEAM_PHOTO', ownerId: TEAM_ID },
      Buffer.from('photo'),
    );
    expect(repository.update).toHaveBeenCalledWith(TEAM_ID, { photoKey: NEW_KEY });
    expect(media.discard).toHaveBeenCalledWith(OLD_KEY);
  });

  it('keeps the old photo and removes the new files when the team cannot be updated', async () => {
    const { service, repository, media } = createFixture();
    repository.update.mockRejectedValue(new Error('database down'));

    await expect(service.replace(TEAM_ID, Buffer.from('photo'))).rejects.toThrow('database down');

    expect(media.discard).toHaveBeenCalledTimes(1);
    expect(media.discard).toHaveBeenCalledWith(NEW_KEY);
  });
});

describe('TeamPhotoService.remove', () => {
  it('clears the photo of the team and deletes its files', async () => {
    const { service, repository, media } = createFixture();

    await service.remove(TEAM_ID);

    expect(repository.update).toHaveBeenCalledWith(TEAM_ID, { photoKey: null });
    expect(media.discard).toHaveBeenCalledWith(OLD_KEY);
  });
});
