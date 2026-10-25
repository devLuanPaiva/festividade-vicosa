import type { ReactElement } from 'react';
import { getMatchOutcome } from '../lib/match-outcome';
import { buildMatchShare } from '../lib/match-share';
import type { MatchDetail } from '../services/get-match-detail';

const BRAND_BACKGROUND = '#073b86';
const SUN = '#fad90e';
const WHITE = '#ffffff';
const CARD_PADDING = 64;
const TEAM_NAME_WIDTH = 380;
const SCORE_FONT_SIZE = 96;

interface MatchShareCardProps {
  detail: MatchDetail;
}

export function MatchShareCard({ detail }: MatchShareCardProps): ReactElement {
  const { match, teamA, teamB } = detail;
  const { sideA, sideB } = getMatchOutcome(match);
  const isScheduled = match.status === 'SCHEDULED';
  const { description } = buildMatchShare(detail);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: CARD_PADDING,
        background: BRAND_BACKGROUND,
        color: WHITE,
      }}
    >
      <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: SUN }}>
        Festividade de Viçosa 2026
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', width: TEAM_NAME_WIDTH, fontSize: 56, fontWeight: 700 }}>
          {teamA.name}
        </div>
        <div
          style={{
            display: 'flex',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            fontSize: SCORE_FONT_SIZE,
            fontWeight: 700,
            color: SUN,
          }}
        >
          {isScheduled ? 'x' : `${sideA.score} x ${sideB.score}`}
        </div>
        <div
          style={{
            display: 'flex',
            width: TEAM_NAME_WIDTH,
            justifyContent: 'flex-end',
            textAlign: 'right',
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          {teamB.name}
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 34 }}>{description}</div>
    </div>
  );
}
