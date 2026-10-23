import { ConflictException } from '@nestjs/common';
import type { Match } from '../entities/match.entity';
import { MatchRound, MatchStage, MatchStatus } from '../enums/match.enums';
import type { MatchRepository } from '../repository/match.repository';
import { MatchBracketAdvancer } from './match-bracket-advancer.service';

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const FIRST_DAY = new Date('2026-12-18T22:00:00.000Z');
const SECOND_DAY = new Date('2026-12-19T22:00:00.000Z');

function bracketMatch(overrides: Partial<Match>): Match {
  return {
    id: 'match',
    categoryId: CATEGORY_ID,
    stage: MatchStage.KNOCKOUT,
    groupId: null,
    round: MatchRound.QUARTER_FINAL,
    bracketPosition: 0,
    scheduledAt: FIRST_DAY,
    status: MatchStatus.FINALIZED,
    teamAId: 'one',
    teamBId: 'eight',
    winnerId: 'one',
    ...overrides,
  } as Match;
}

function createAdvancer(slots: Record<string, Match | null>): {
  advancer: MatchBracketAdvancer;
  repository: Record<'findBracketMatch' | 'create' | 'update', jest.Mock>;
} {
  const repository = {
    findBracketMatch: jest.fn((_: string, round: MatchRound, position: number) =>
      Promise.resolve(slots[`${round}:${position}`] ?? null),
    ),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };
  const advancer = new MatchBracketAdvancer(repository as unknown as MatchRepository);
  return { advancer, repository };
}

describe('MatchBracketAdvancer.advance', () => {
  it('ignores matches that are not part of a generated bracket', async () => {
    const { advancer, repository } = createAdvancer({});

    await advancer.advance(bracketMatch({ bracketPosition: null }));
    await advancer.advance(bracketMatch({ stage: MatchStage.GROUP, round: null }));

    expect(repository.findBracketMatch).not.toHaveBeenCalled();
  });

  it('waits for the sibling match before creating the next round match', async () => {
    const sibling = bracketMatch({ bracketPosition: 1, status: MatchStatus.SCHEDULED });
    const { advancer, repository } = createAdvancer({
      [`${MatchRound.QUARTER_FINAL}:1`]: sibling,
    });

    await advancer.advance(bracketMatch({}));

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('creates the next round match once both feeders are finalized', async () => {
    const sibling = bracketMatch({
      bracketPosition: 1,
      scheduledAt: SECOND_DAY,
      teamAId: 'four',
      teamBId: 'five',
      winnerId: 'five',
    });
    const { advancer, repository } = createAdvancer({
      [`${MatchRound.QUARTER_FINAL}:1`]: sibling,
    });

    await advancer.advance(bracketMatch({}));

    expect(repository.create).toHaveBeenCalledWith({
      categoryId: CATEGORY_ID,
      stage: MatchStage.KNOCKOUT,
      groupId: null,
      round: MatchRound.SEMI_FINAL,
      bracketPosition: 0,
      scheduledAt: SECOND_DAY,
      location: null,
      teamAId: 'one',
      teamBId: 'five',
    });
  });

  it('puts the winner of the higher position in the second slot', async () => {
    const sibling = bracketMatch({ bracketPosition: 0, winnerId: 'one' });
    const { advancer, repository } = createAdvancer({
      [`${MatchRound.QUARTER_FINAL}:0`]: sibling,
    });

    await advancer.advance(
      bracketMatch({ bracketPosition: 1, teamAId: 'four', teamBId: 'five', winnerId: 'four' }),
    );

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ bracketPosition: 0, teamAId: 'one', teamBId: 'four' }),
    );
  });

  it('only updates the slot when the next round match already exists', async () => {
    const next = bracketMatch({
      id: 'semi',
      round: MatchRound.SEMI_FINAL,
      status: MatchStatus.SCHEDULED,
    });
    const { advancer, repository } = createAdvancer({ [`${MatchRound.SEMI_FINAL}:0`]: next });

    await advancer.advance(bracketMatch({ winnerId: 'eight' }));

    expect(repository.update).toHaveBeenCalledWith('semi', { teamAId: 'eight' });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('sends the semifinal losers to the third place match and the winners to the final', async () => {
    const semifinal = bracketMatch({ round: MatchRound.SEMI_FINAL, bracketPosition: 0 });
    const sibling = bracketMatch({
      round: MatchRound.SEMI_FINAL,
      bracketPosition: 1,
      teamAId: 'two',
      teamBId: 'three',
      winnerId: 'three',
    });
    const { advancer, repository } = createAdvancer({
      [`${MatchRound.SEMI_FINAL}:1`]: sibling,
    });

    await advancer.advance(semifinal);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ round: MatchRound.FINAL, teamAId: 'one', teamBId: 'three' }),
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ round: MatchRound.THIRD_PLACE, teamAId: 'eight', teamBId: 'two' }),
    );
  });

  it('does not advance after the final or the third place match', async () => {
    const { advancer, repository } = createAdvancer({});

    await advancer.advance(bracketMatch({ round: MatchRound.FINAL }));
    await advancer.advance(bracketMatch({ round: MatchRound.THIRD_PLACE }));

    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe('MatchBracketAdvancer.assertCorrectionAllowed', () => {
  const playedNext = bracketMatch({
    round: MatchRound.SEMI_FINAL,
    teamAId: 'one',
    teamBId: 'five',
    status: MatchStatus.FINALIZED,
  });

  it('allows any correction while the next round match is not finalized', async () => {
    const next = bracketMatch({
      round: MatchRound.SEMI_FINAL,
      status: MatchStatus.SCHEDULED,
    });
    const { advancer } = createAdvancer({ [`${MatchRound.SEMI_FINAL}:0`]: next });

    await expect(
      advancer.assertCorrectionAllowed(bracketMatch({}), 'eight'),
    ).resolves.toBeUndefined();
  });

  it('allows a correction that keeps the winner of a match whose next round was played', async () => {
    const { advancer } = createAdvancer({ [`${MatchRound.SEMI_FINAL}:0`]: playedNext });

    await expect(
      advancer.assertCorrectionAllowed(bracketMatch({}), 'one'),
    ).resolves.toBeUndefined();
  });

  it('refuses to change the winner when the next round match was finalized', async () => {
    const { advancer } = createAdvancer({ [`${MatchRound.SEMI_FINAL}:0`]: playedNext });

    await expect(
      advancer.assertCorrectionAllowed(bracketMatch({}), 'eight'),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
