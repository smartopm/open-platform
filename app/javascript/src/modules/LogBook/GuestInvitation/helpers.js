/* eslint-disable import/prefer-default-export */
import { objectAccessor } from '../../../utils/helpers';

// make sure we have at least one name for the guest
export function filterEmptyObjectByKey(arr, key){
    if(!arr || !arr.length) return []
    return arr.filter(value => objectAccessor(value, key).length !== 0)
}