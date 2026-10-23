import { ILike, type FindOperator } from 'typeorm';

const LIKE_SPECIAL_CHARACTERS = /[\\%_]/g;
const ESCAPED_MATCH = String.raw`\$&`;

function escapeLikeCharacters(text: string): string {
  return text.replace(LIKE_SPECIAL_CHARACTERS, ESCAPED_MATCH);
}

export function containsText(text: string): FindOperator<string> {
  const escaped = escapeLikeCharacters(text.trim());
  return ILike(`%${escaped}%`);
}
