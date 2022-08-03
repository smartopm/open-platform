import { renderHook, act } from '@testing-library/react-hooks';
import useDebouncedValue from '../../hooks/useDebouncedValue';

describe('useDebouncedValue hook', () => {
  it('should not break and should return default values', async () => {
    const { result, waitFor } = renderHook(() => useDebouncedValue(50));
    // value initially is blank
    expect(result.current).toHaveProperty('value', '');
    expect(result.current).toHaveProperty('dbcValue', '');
    expect(result.current.setSearchValue).toBeInstanceOf(Function);

    act(() => result.current.setSearchValue('94242'))

    await waitFor(() => {
        // value initially should be updated
      expect(result.current).toHaveProperty('value', '94242');
      expect(result.current).toHaveProperty('dbcValue', '94242');
    }, 50);
  });
});
