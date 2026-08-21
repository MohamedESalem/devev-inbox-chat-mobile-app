import { DEFAULT_AUTHENTICATED_TAB } from '../../navigationDefaults';

describe('authenticated tab defaults', () => {
  it('lands agents on Conversations when there is no more specific navigation target', () => {
    expect(DEFAULT_AUTHENTICATED_TAB).toBe('Conversations');
  });
});
