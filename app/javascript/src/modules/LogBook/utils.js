/* eslint-disable import/prefer-default-export */

// import { dateTimeToString } from "../../components/DateContainer";
import { getWeekDay } from "../../utils/dateutil";
import { titleCase } from '../../utils/helpers'

export function checkInValidRequiredFields(formData, requiredFields) {
  const values = requiredFields.map(field => formData[String(field)]);

  return values.some(isNotValidCheck);
}

export function isNotValidCheck(element) {
  return !element;
}

export const defaultRequiredFields= ['name', 'phoneNumber', 'nrc', 'vehiclePlate', 'reason']


// TODO get this translated
// add another case for one day visits
export function checkRequests(req){
  const today = new Date()
  const dayOfTheWeek = getWeekDay(today)
    if(req.occursOn.length){ // if true then we know this will happen again
      if(req.occursOn.includes(dayOfTheWeek.toLowerCase())){ // if true then we know today they can be allowed in 
        if(today > new Date(req.startTime) && today < new Date(req.endTime)){
          return { title: 'Valid', color: '#66A69B', valid: true }
        }
        return { title: 'Invalid Now', color: '#E74540', valid: false }
      }
      return { title: 'Invalid Today', color: '#E74540', valid: false }
    } if (today > new Date(req.startTime) && today < new Date(req.endTime)) {
      return { title: 'Valid', color: '#66A69B', valid: true }
    }
    return { title: 'Expired', color: '#E74540', valid: false }
}


export function cleanUpWeekDays(days){
  if(!days || !days.length) return 'Never'
  return days.map(day => `${titleCase(day)}s `)
}