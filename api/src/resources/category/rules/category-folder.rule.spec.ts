import { SubEventType } from '../../sub-event/enums/sub-event-type.enum';
import { Gender } from '../enums/gender.enum';
import { categoryFolderName } from './category-folder.rule';

describe('categoryFolderName', () => {
  it.each([
    {
      subEventType: SubEventType.JOCEV_FUTSAL,
      name: 'Sub-15',
      gender: Gender.MALE,
      expected: 'futsal-sub-15-masculino',
    },
    {
      subEventType: SubEventType.JOCEV_HANDBALL,
      name: 'Sub-15',
      gender: Gender.MALE,
      expected: 'handebol-sub-15-masculino',
    },
    {
      subEventType: SubEventType.JOCEV_FUTSAL,
      name: 'Adulto Único',
      gender: Gender.FEMALE,
      expected: 'futsal-adulto-unico-feminino',
    },
  ])('names the folder $expected', ({ expected, ...input }) => {
    expect(categoryFolderName(input)).toBe(expected);
  });

  it('does not repeat the gender when the name of the category already has it', () => {
    expect(
      categoryFolderName({
        subEventType: SubEventType.JOCEV_HANDBALL,
        name: '12 a 14 Feminino',
        gender: Gender.FEMALE,
      }),
    ).toBe('handebol-12-a-14-feminino');
  });

  it('keeps the same category of two modalities in different folders', () => {
    const futsal = categoryFolderName({
      subEventType: SubEventType.JOCEV_FUTSAL,
      name: 'Sub-13',
      gender: Gender.FEMALE,
    });
    const handball = categoryFolderName({
      subEventType: SubEventType.JOCEV_HANDBALL,
      name: 'Sub-13',
      gender: Gender.FEMALE,
    });

    expect(futsal).not.toBe(handball);
  });
});
