import { pageCount, paginate } from './array.utils';

describe('array.utils', () => {
  it('slices the requested 1-based page', () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginate(items, 1, 2)).toEqual([1, 2]);
    expect(paginate(items, 3, 2)).toEqual([5]);
    expect(paginate(items, 4, 2)).toEqual([]);
  });

  it('never reports fewer than one page', () => {
    expect(pageCount(0, 10)).toBe(1);
    expect(pageCount(21, 10)).toBe(3);
  });
});
