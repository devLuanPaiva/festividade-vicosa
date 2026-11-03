import { slugify } from '../../../common/text/slugify';
import { SubEventType } from '../../sub-event/enums/sub-event-type.enum';
import { Gender } from '../enums/gender.enum';

const MODALITY_NAMES: Partial<Record<SubEventType, string>> = {
  [SubEventType.JOCEV_FUTSAL]: 'futsal',
  [SubEventType.JOCEV_HANDBALL]: 'handebol',
};

const GENDER_NAMES: Record<Gender, string> = {
  [Gender.MALE]: 'masculino',
  [Gender.FEMALE]: 'feminino',
};

export interface CategoryFolderInput {
  subEventType: SubEventType;
  name: string;
  gender: Gender;
}

export function categoryFolderName({ subEventType, name, gender }: CategoryFolderInput): string {
  const modality = MODALITY_NAMES[subEventType] ?? subEventType;
  const genderName = GENDER_NAMES[gender];
  const nameSlug = slugify(name);
  const hasGender = nameSlug.split('-').includes(genderName);
  return slugify(`${modality} ${nameSlug} ${hasGender ? '' : genderName}`);
}
