import {
  ADMIN_CATEGORIES_PATH,
  ADMIN_MATCHES_PATH,
} from '@/features/admin-shell/lib/admin-sections';
import type { KpiTileData, Overview } from '../types';

const integerFormat = new Intl.NumberFormat('pt-BR');
const decimalFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

function todayCaption(today: number): string {
  return today === 0 ? 'Nenhum jogo marcado para hoje' : 'Ver os jogos de hoje';
}

function overdueCaption(overdue: number): string {
  return overdue === 0 ? 'Tudo em dia' : 'Já passaram do horário';
}

export function buildKpiTiles({ matches, goals, teams, categories }: Overview): KpiTileData[] {
  return [
    {
      key: 'finalized',
      label: 'Partidas finalizadas',
      value: integerFormat.format(matches.finalized),
      caption: `de ${integerFormat.format(matches.total)} partidas (${matches.completionRate}%)`,
      href: ADMIN_MATCHES_PATH,
      meterPercent: matches.completionRate,
      needsAttention: false,
    },
    {
      key: 'today',
      label: 'Jogos hoje',
      value: integerFormat.format(matches.today),
      caption: todayCaption(matches.today),
      href: ADMIN_MATCHES_PATH,
      meterPercent: null,
      needsAttention: false,
    },
    {
      key: 'overdue',
      label: 'Sem resultado lançado',
      value: integerFormat.format(matches.overdue),
      caption: overdueCaption(matches.overdue),
      href: ADMIN_MATCHES_PATH,
      meterPercent: null,
      needsAttention: matches.overdue > 0,
    },
    {
      key: 'goals',
      label: 'Gols marcados',
      value: integerFormat.format(goals.total),
      caption: `${decimalFormat.format(goals.perMatch)} por partida jogada`,
      href: null,
      meterPercent: null,
      needsAttention: false,
    },
    {
      key: 'teams',
      label: 'Times',
      value: integerFormat.format(teams),
      caption: `em ${integerFormat.format(categories)} categorias`,
      href: ADMIN_CATEGORIES_PATH,
      meterPercent: null,
      needsAttention: false,
    },
  ];
}
