import reducer from '../labelSlice';

describe('labelSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      ids: [],
      entities: {},
      isLoading: false,
    });
  });
});
