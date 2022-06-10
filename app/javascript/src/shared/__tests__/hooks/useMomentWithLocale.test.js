import { renderHook } from '@testing-library/react-hooks';
import authState from '../../../__mocks__/authstate';
import useMomentWithLocale from '../../hooks/useMomentWithLocale';

describe('useMomentWithLocale hook', () => {
  it('should return moment object instance', async () => {
    const { result, waitFor } = renderHook(() => useMomentWithLocale());
    await waitFor(() => {
      expect(result.current.isMoment(result.current())).toBeTruthy();
    });
  });

  it('should return moment with default language or community locale', async () => {
    const { result, waitFor } = renderHook(() => useMomentWithLocale());
    await waitFor(() => {
      expect(result.current.locale()).toEqual('en');
    });
  });

  it('should return moment with authenticated user default language', async () => {
    const auth = { ...authState, user: { community: { locale: 'es' } } };
    const { result, waitFor } = renderHook(() => useMomentWithLocale(auth));
    await waitFor(() => {
      expect(result.current.locale()).toEqual('es');
    });
  });
});
