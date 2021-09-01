/* eslint-disable import/prefer-default-export */
import { dateTimeToString } from '../../components/DateContainer';
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
  const startTime = dateTimeToString(req.startTime);
  const endTime = dateTimeToString(req.endTime);
  const nowTime = dateTimeToString(today);

  const dayOfTheWeek = getWeekDay(today);
  if (req.occursOn.length) {
    if (req.occursOn.includes(dayOfTheWeek.toLowerCase())) {
      if (
        parseInt(nowTime, 10) > parseInt(startTime, 10) &&
        parseInt(nowTime, 10) < parseInt(endTime, 10)
      ) {
        return { title: translate('guest_book.valid'), color: '#00A98B', valid: true };
      }
      return { title: translate('guest_book.invalid_now'), color: '#E74540', valid: false };
    }
    return { title: translate('guest_book.invalid_today'), color: '#E74540', valid: false };
  }
  if (
    parseInt(nowTime, 10) > parseInt(startTime, 10) &&
    parseInt(nowTime, 10) < parseInt(endTime, 10)
  ) {
    return { title: translate('guest_book.valid'), color: '#00A98B', valid: true };
  }
  if (today > new Date(req.visitEndDate)) {
    return { title: translate('guest_book.expired'), color: '#DA1414', valid: false };
  }
  return { title: translate('guest_book.expired'), color: '#DA1414', valid: false };
}
