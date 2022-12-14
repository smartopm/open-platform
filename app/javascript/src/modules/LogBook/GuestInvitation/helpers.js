/* eslint-disable import/prefer-default-export */
import { objectAccessor } from '../../../utils/helpers';

// make sure we have at least one name for the guest
export function filterEmptyObjectByKey(arr, key) {
  if (!arr || !arr.length) return [];
  return arr.filter(value => objectAccessor(value, key).length !== 0);
}

export function validateGuest({ guests, userIds, t, guestData, update }) {
  if (!update && !userIds?.length && !guests?.length) {
    return { msg: t('common:errors.no_guests_to_invite'), valid: false };
  }
  const values = Object.values(guestData);
  const isAnyInvalid = values.some(value => !value);

  if (isAnyInvalid) {
    return { msg: t('common:errors.invalid_time'), valid: false };
  }
  return { msg: null, valid: true };
}


/**
 * Return initial letters for each days, if none return nothing
 * @param {[String]} days
 */
export function formatReoccuringDays(days){
  if (!days || !days.length) return '-'
  return days.map(day => ` ${day.charAt(0).toUpperCase()} `)
}
