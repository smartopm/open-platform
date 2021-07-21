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