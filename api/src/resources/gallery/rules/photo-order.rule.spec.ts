import { isCompleteOrder } from './photo-order.rule';

describe('isCompleteOrder', () => {
  const albumPhotoIds = ['a', 'b', 'c'];

  it.each([
    { name: 'accepts the same photos in another order', ordered: ['c', 'a', 'b'], expected: true },
    { name: 'refuses a list that leaves a photo out', ordered: ['a', 'b'], expected: false },
    { name: 'refuses a photo from another album', ordered: ['a', 'b', 'x'], expected: false },
    { name: 'refuses a repeated photo', ordered: ['a', 'a', 'b'], expected: false },
    { name: 'refuses extra photos', ordered: ['a', 'b', 'c', 'd'], expected: false },
  ])('$name', ({ ordered, expected }) => {
    expect(isCompleteOrder(ordered, albumPhotoIds)).toBe(expected);
  });
});
