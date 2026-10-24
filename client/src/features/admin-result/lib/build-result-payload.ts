import type { ResultPayload, ResultValues } from '../types';

type PayloadFields = Partial<Omit<ResultPayload, 'resultType'>>;

function penaltiesPayload(values: ResultValues): PayloadFields {
  if (values.penaltiesA === null && values.penaltiesB === null) {
    return {};
  }
  return { penaltiesA: values.penaltiesA, penaltiesB: values.penaltiesB };
}

function bestPlayerPayload(values: ResultValues): PayloadFields {
  if (values.bestPlayerName === '') {
    return {};
  }
  const photo = values.bestPlayerPhotoKey ? { bestPlayerPhotoKey: values.bestPlayerPhotoKey } : {};
  return {
    bestPlayerName: values.bestPlayerName,
    bestPlayerTeamId: values.bestPlayerTeamId,
    ...photo,
  };
}

export function buildResultPayload(values: ResultValues): ResultPayload {
  if (values.resultType === 'DOUBLE_WALKOVER') {
    return { resultType: 'DOUBLE_WALKOVER' };
  }
  if (values.resultType === 'WALKOVER') {
    return { resultType: 'WALKOVER', walkoverWinnerId: values.walkoverWinnerId };
  }
  return {
    resultType: 'PLAYED',
    scoreA: values.scoreA,
    scoreB: values.scoreB,
    ...penaltiesPayload(values),
    ...bestPlayerPayload(values),
  };
}
