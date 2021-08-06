/* eslint-disable no-plusplus */
import { dateToString } from "../../components/DateContainer";

/**
 * Checks whether the given value is a date, if it is then it formats it properly
 * Also checks if the value has checked like this {"checked"=>"3", "label"=>"Ano"} and picks the value
 * @param {String} value
 */
 export default function formatCellData(data, translate) {
    if (!data || !data?.value) return '-';
    if (!Number.isNaN(Date.parse(data.value)) && data.fieldType === 'date') {
      return dateToString(data.value);
    }
    if (data.value?.includes('checked')) {
      return data.value.split('"')[3]; // TODO: Find a better way to handle this extraction
    }
    if (data.fieldType === 'file_upload') {
      return translate('misc.attachments');
    }
    return data.value;
  }

export function checkExtraShifts(formattedShifts){
  const shifts = formattedShifts;
    const extras = []
    for (let index = 0; index < shifts.length; index++) {
      const current = shifts[Number(index)];
      const next = shifts.length === index + 1 ? current : shifts[index + 1];
      if (+next[0] > +current[0]) {
        extras.push([current[0], next[1]])
        shifts.splice(index, 1)
      }
      // eslint-disable-next-line eqeqeq
      if(next == current){
        extras.push([next[0], next[1]])
      }
    }
   return extras
}


export function countShifts(shifts) {
  const extraHours = checkExtraShifts(shifts)
  const hours = []
  for (let index = 0; index < extraHours.length; index++) {
    const element = extraHours[Number(index)];
    const diff = +element[1] - +element[0]
    hours.push(diff)
  }
  return hours.reduce((a, b) => a + b)
}

export function formatShifts(entryShift, exitShift){
  return entryShift.map((e, i) => [e.value, exitShift[Number(i)].value])
}