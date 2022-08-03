import { renderHook } from '@testing-library/react-hooks';
import useFetchMoreRecords from '../../hooks/useFetchMoreRecords';

describe('useFetchMoreRecords hook', () => {
  it('should return the expected values', () => {
    const fetcher = jest.fn();
    const { result } = renderHook(() => useFetchMoreRecords(fetcher, 'somedata', { offset: 1 }));
    expect(result.current.loadMore).toBeInstanceOf(Function);
    expect(result.current.hasMoreRecord).toBe(true);
    result.current.loadMore();
    expect(fetcher).toBeCalled();
  });
});
