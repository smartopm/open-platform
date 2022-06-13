import { renderHook, act } from '@testing-library/react-hooks';

import useStateIfMounted from '../../hooks/useStateIfMounted';

describe('useStateIfMounted hook', () => {
  it('should return passed value after component has mounted', async () => {
    const { result, waitFor } = renderHook(() => useStateIfMounted(50));
    expect(result.current[0]).toEqual(50);
    expect(result.current[1]).toBeInstanceOf(Function);
    act(() => result.current[1](500));

    await waitFor(() => {
      expect(result.current[0]).toEqual(500);
    });
  });
});
