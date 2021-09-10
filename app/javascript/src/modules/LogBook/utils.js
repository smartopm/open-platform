/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { getWeekDay } from '../../utils/dateutil';

export function checkInValidRequiredFields(formData, requiredFields) {
  const values = requiredFields.map(field => formData[String(field)]);

  return values.some(isNotValidCheck);
}

export function isNotValidCheck(element) {
  return !element;
}

export const defaultRequiredFields = ['name', 'phoneNumber', 'nrc', 'vehiclePlate', 'reason'];

export function checkRequests(req, translate) {

  const today = new Date();
  const dayOfTheWeek = getWeekDay(today);


  if (req.occursOn.length) {
    if (today > new Date(req.visitEndDate)) {
      return { title: translate('guest_book.expired'), color: '#DA1414', valid: false };
    }
    if (req.occursOn.includes(dayOfTheWeek.toLowerCase())) {
      if (
        moment().isSameOrAfter(req.startTime) && moment().isSameOrBefore(req.endTime)
      ) {
        return { title: translate('guest_book.valid'), color: '#00A98B', valid: true };
      }
      return { title: translate('guest_book.invalid_now'), color: '#E74540', valid: false };
    }
    return { title: translate('guest_book.invalid_today'), color: '#E74540', valid: false };
  }
    // is today the right date
    if (moment(req.visitationDate).isSame(moment(), 'day')) {
      if (
        moment().isSameOrAfter(req.startTime) && moment().isSameOrBefore(req.endTime)
      ) {
        return { title: translate('guest_book.valid'), color: '#00A98B', valid: true };
      }
      return { title: translate('guest_book.invalid_now'), color: '#E74540', valid: false };
    }
    return { title: translate('guest_book.invalid_today'), color: '#E74540', valid: false };
}


