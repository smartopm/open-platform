import moment from 'moment-timezone';
import { useContext } from 'react';
import { Context } from '../../containers/Provider/AuthStateProvider';

/**
 * This is to set locales for translating moment-related methods.
 * @param {Object} auth (optional) represents the authenticated user, if present in the component
 * @returns translated moment.js object instance
 */
export default function useMomentWithLocale(auth) {
  const reusableMoment = moment;
  const authState = useContext(Context);

  if (auth || authState?.loggedIn) {
    const preferredAuth = auth || authState;
    const savedLang = localStorage.getItem('default-language');
    reusableMoment.locale(savedLang || preferredAuth?.user?.community?.locale);
  }
  return reusableMoment;
}
