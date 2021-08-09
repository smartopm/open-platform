/* eslint-disable no-plusplus */
import { parseISO } from "date-fns";
import differenceInHours from "date-fns/differenceInHours";
import isAfter from "date-fns/isAfter/index";
import { dateTimeToString, dateToString } from "../../components/DateContainer";

/**
 * Checks whether the given value is a date, if it is then it formats it properly
 * Also checks if the value has checked like this {"checked"=>"3", "label"=>"Ano"} and picks the value
 * @param {String} value
 */
 export default function formatCellData(data, translate) {
    if (!data || !data?.value) return '-';
    if (!Number.isNaN(Date.parse(data.value)) && data.fieldType === 'date') {
      return `${dateToString(data.value)} - ${dateTimeToString(data.value)}`
    }
    if (data.value?.includes('checked')) {
      return data.value.split('"')[3]; // TODO: Find a better way to handle this extraction
    }
    if (data.fieldType === 'file_upload') {
      return translate('misc.attachments');
    }
    return data.value;
  }

/**
 *
 * @param {[object]} formattedShifts a
 * @description gets a list of shifts and finds hours that overlap
 * @returns {[startTime: String, endTime: String]} an array of start and end time for each shift with no overlaps
 */
export function checkExtraShifts(formattedShifts){
  const shifts = formattedShifts;
    const extras = []
    for (let index = 0; index < shifts.length; index++) {
      const current = shifts[Number(index)];
      // last shift wont have a next value so we equate it to current value and check later
      const next = shifts.length === index + 1 ? current : shifts[index + 1];
      // if (Number(next[0]) > Number(current[0])) {
      if (isAfter(parseISO(next[0]), parseISO(current[0]))) {
        extras.push([current[0], next[1]])
        shifts.splice(index, 1)
      }
      // eslint-disable-next-line eqeqeq
      if(next == current){
      // case where there is a remaining shift with no overlapping time we add it to extras
        extras.push([next[0], next[1]])
      }
    }
   return extras
}


/**
 *
 * @param {[Number]} shifts a 2d array that contains formatted shifts with no overlaps
 * @description finds a total difference in each formatted shift and sums them all up
 * @returns {Number} a sum of all shifts
 */
export function countExtraHours(extraHours) {
  const hours = []
  for (let index = 0; index < extraHours.length; index++) {
    const element = extraHours[Number(index)];
    const diff = differenceInHours(parseISO(element[1]), parseISO(element[0]))
    hours.push(diff)
  }
  return hours.reduce((a, b) => a + b, 0)
}

/**
 *
 * @param {[object]} entryShift - an array that contains all the entry hours collected from the form
 * @param {[object]} exitShift  - an array that contains all the exit hours collected from the form
 * @returns {[[String]]} a 2d array of strings that contain values from entry and exit hours collected from the form
 */
export function formatShifts(entryShift, exitShift){
  if(!entryShift || !exitShift) return []
  return entryShift.map((e, i) => [e.value, exitShift[Number(i)].value])
}