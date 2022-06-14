import moment from 'moment-timezone';
import { useContext } from 'react';
import { Context } from '../../containers/Provider/AuthStateProvider';

/**
 * This is to set locales for translating moment-related methods.
 * @returns translated moment.js object instance
 */
export default function useMomentWithLocale() {
  const reusableMoment = moment;
  const authState = useContext(Context);

  if (authState?.loggedIn) {
    const savedLang = localStorage.getItem('default-language');
    reusableMoment.locale(savedLang || authState?.user?.community?.locale);
  }
  return reusableMoment;
}
