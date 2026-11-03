import { describe, expect, it } from 'vitest';
import type { Team } from '@/features/games/types';
import type { MatchGroup } from '../types';
import { buildRosterSections } from './roster-sections';

function teamIn(id: string, groupId: string | null): Team {
  return { id, groupId, name: `Time ${id}` } as Team;
}

const GROUP_A: MatchGroup = { id: 'a', categoryId: 'c', name: 'Grupo A' };
const GROUP_B: MatchGroup = { id: 'b', categoryId: 'c', name: 'Grupo B' };

function idsOf(teams: Team[]): string[] {
  return teams.map((team) => team.id);
}

describe('buildRosterSections', () => {
  it('lists the teams under their group, keeping an empty group visible', () => {
    const sections = buildRosterSections([GROUP_A, GROUP_B], [teamIn('1', 'a'), teamIn('2', 'a')]);

    expect(sections.map((section) => section.title)).toEqual(['Grupo A', 'Grupo B']);
    expect(idsOf(sections[0]?.teams ?? [])).toEqual(['1', '2']);
    expect(sections[1]?.teams).toEqual([]);
  });

  it('collects teams without a group, or from a deleted group, in a last section', () => {
    const sections = buildRosterSections(
      [GROUP_A],
      [teamIn('1', 'a'), teamIn('2', null), teamIn('3', 'deleted-group')],
    );

    const last = sections[sections.length - 1];
    expect(last?.title).toBe('Sem grupo');
    expect(idsOf(last?.teams ?? [])).toEqual(['2', '3']);
  });

  it('does not show the section without group when every team has one', () => {
    const sections = buildRosterSections([GROUP_A], [teamIn('1', 'a')]);

    expect(sections.map((section) => section.title)).toEqual(['Grupo A']);
  });
});
