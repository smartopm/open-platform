/* eslint-disable import/prefer-default-export */
import moment from 'moment-timezone'
import { updateDateWithTime } from '../../components/DateContainer';
import { getWeekDay } from '../../utils/dateutil';

export function checkInValidRequiredFields(formData, requiredFields) {
  const values = requiredFields.map(field => formData[String(field)]);

  return values.some(isNotValidCheck);
}

export function isNotValidCheck(element) {
  return !element;
}

export const defaultRequiredFields = ['name', 'phoneNumber', 'nrc', 'vehiclePlate', 'reason'];

/**
 * Checks if a guest is valid to be granted access at the gate at the time of visiting the site
 * @param {object} req
 * @param {Function} translate
 * @param {String} tz
 * @returns
 */
// eslint-disable-next-line complexity
export function checkRequests(req, translate, tz) {
  /**
   * moved the conversion here because:
   *  - If a user updates a request's visitation date, the time wont be changed, this will fail our validity check
   *  - If the guest is re-occuring then the visitation date won't be the same as the date for the endsAt or startsAt time
   *  - moment's isSameOrAfter() and isSameOrBefore() rely on a full date instead of just time to validate the time.
   *  - Having the updateDateWithTime here, allows us to always rely on today's date as the date for both the endsAt and startsAt times
   */

  // today in the timezone of the current community
  const timeNow = moment.tz(tz)

  const startTime = updateDateWithTime(new Date(), req.startsAt || req.startTime, tz)
  const endTime = updateDateWithTime(new Date(), req.endsAt || req.endTime, tz)

  const dayOfTheWeek = getWeekDay(timeNow);
  if(req.revoked){
    return { title: translate('guest_book.revoked'), color: '#BA000D', valid: false };

  }

  if (req.occursOn.length) {
    if (!timeNow.isSameOrBefore(moment.tz(req.visitEndDate, tz), 'day')) {
      return { title: translate('guest_book.expired'), color: '#DA1414', valid: false };
    }
    if (req.occursOn.includes(dayOfTheWeek.toLowerCase())) {
      if (
        timeNow.isSameOrAfter(startTime) && timeNow.isSameOrBefore(endTime)
      ) {
        return { title: translate('guest_book.valid'), color: '#00A98B', valid: true };
      }
      return { title: translate('guest_book.invalid_now'), color: '#E74540', valid: false };
    }
    return { title: translate('guest_book.invalid_today'), color: '#E74540', valid: false };
  }
    // is today the right date
    if (moment.tz(req.visitationDate, tz).isSame(timeNow, 'day')) {
      if (
        timeNow.isSameOrAfter(moment.tz(startTime, tz)) && timeNow.isSameOrBefore(moment.tz(endTime, tz))
      ) {
        return { title: translate('guest_book.valid'), color: '#00A98B', valid: true };
      }
      return { title: translate('guest_book.invalid_now'), color: '#E74540', valid: false };
    }
    return { title: translate('guest_book.invalid_today'), color: '#E74540', valid: false };
}


export function resolveUserOrGuest(request){
  if (!request) {
    return null
  }
  const user =  request.user || request.guest
  return user
}