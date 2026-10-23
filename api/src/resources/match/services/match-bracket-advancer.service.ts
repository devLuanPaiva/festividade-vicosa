import { ConflictException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import type { Match } from '../entities/match.entity';
import { MatchStatus, type MatchRound } from '../enums/match.enums';
import { MatchRepository, type MatchRecord } from '../repository/match.repository';
import {
  loserDestination,
  siblingPosition,
  winnerDestination,
  type BracketDestination,
} from '../rules/bracket.rule';

type Outcome = 'WINNER' | 'LOSER';

interface BracketMatch extends Match {
  round: MatchRound;
  bracketPosition: number;
}

const OUTCOMES: Outcome[] = ['WINNER', 'LOSER'];

function isBracketMatch(match: Match): match is BracketMatch {
  return match.round !== null && match.bracketPosition !== null;
}

function destinationOf(match: BracketMatch, outcome: Outcome): BracketDestination | null {
  return outcome === 'WINNER'
    ? winnerDestination(match.round, match.bracketPosition)
    : loserDestination(match.round, match.bracketPosition);
}

function teamOf(match: Match, outcome: Outcome): string | null {
  if (outcome === 'WINNER' || match.winnerId === null) {
    return match.winnerId;
  }
  return match.winnerId === match.teamAId ? match.teamBId : match.teamAId;
}

function laterOf(first: Date, second: Date): Date {
  return first > second ? first : second;
}

function toNextRecord(source: BracketMatch, sibling: Match, outcome: Outcome): MatchRecord | null {
  const destination = destinationOf(source, outcome);
  const sourceTeam = teamOf(source, outcome);
  const siblingTeam = teamOf(sibling, outcome);
  if (!destination || !sourceTeam || !siblingTeam) {
    return null;
  }
  const isSourceTeamA = destination.slot === 'teamAId';
  return {
    categoryId: source.categoryId,
    stage: source.stage,
    groupId: null,
    round: destination.round,
    bracketPosition: destination.bracketPosition,
    scheduledAt: laterOf(source.scheduledAt, sibling.scheduledAt),
    location: null,
    teamAId: isSourceTeamA ? sourceTeam : siblingTeam,
    teamBId: isSourceTeamA ? siblingTeam : sourceTeam,
  };
}

@Injectable()
export class MatchBracketAdvancer {
  public constructor(private readonly matchRepository: MatchRepository) {}

  public async assertCorrectionAllowed(match: Match, winnerId: string | null): Promise<void> {
    if (!isBracketMatch(match)) {
      return;
    }
    const corrected = { ...match, winnerId };
    for (const outcome of OUTCOMES) {
      await this.assertNextMatchOpen(corrected, outcome);
    }
  }

  public async advance(match: Match): Promise<void> {
    if (!isBracketMatch(match)) {
      return;
    }
    for (const outcome of OUTCOMES) {
      await this.place(match, outcome);
    }
  }

  private async findDestinationMatch(
    match: BracketMatch,
    outcome: Outcome,
  ): Promise<{ destination: BracketDestination; next: Match | null } | null> {
    const destination = destinationOf(match, outcome);
    if (!destination) {
      return null;
    }
    const next = await this.matchRepository.findBracketMatch(
      match.categoryId,
      destination.round,
      destination.bracketPosition,
    );
    return { destination, next };
  }

  private async assertNextMatchOpen(match: BracketMatch, outcome: Outcome): Promise<void> {
    const found = await this.findDestinationMatch(match, outcome);
    const teamId = teamOf(match, outcome);
    if (found?.next?.status !== MatchStatus.FINALIZED) {
      return;
    }
    if (found.next[found.destination.slot] !== teamId) {
      throw new ConflictException(
        apiError(
          'NEXT_ROUND_ALREADY_PLAYED',
          'A partida da próxima rodada já foi finalizada. Corrija-a antes de mudar este resultado.',
          'resultType',
        ),
      );
    }
  }

  private async place(match: BracketMatch, outcome: Outcome): Promise<void> {
    const found = await this.findDestinationMatch(match, outcome);
    const teamId = teamOf(match, outcome);
    if (!found || !teamId) {
      return;
    }
    if (found.next) {
      await this.matchRepository.update(found.next.id, { [found.destination.slot]: teamId });
      return;
    }
    await this.createNextMatch(match, outcome);
  }

  private async createNextMatch(match: BracketMatch, outcome: Outcome): Promise<void> {
    const sibling = await this.matchRepository.findBracketMatch(
      match.categoryId,
      match.round,
      siblingPosition(match.bracketPosition),
    );
    if (sibling?.status !== MatchStatus.FINALIZED) {
      return;
    }
    const record = toNextRecord(match, sibling, outcome);
    if (record) {
      await this.matchRepository.create(record);
    }
  }
}
