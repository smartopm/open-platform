/* eslint-disable no-eval */
/* eslint-disable security/detect-eval-with-expression */
import dompurify from 'dompurify';

/**
 *
 * @param {{}} values
 * @param {String} propId
 * @returns {Boolean}
 * @description checks if a form property exist
 */
export function propExists(values, propId) {
  return values.some(value => value.form_property_id === propId);
}

/**
 *
 * @param {object} properties
 * @param {String} propId
 * @description check form values that weren't filled in and add default values
 */
export function addPropWithValue(properties, propId) {
  if (propExists(properties, propId)) {
    return;
  }
  properties.push({ value: null, form_property_id: propId });
}

/**
 *
 * @param {[object]} categories
 * @returns {[object]} a flat array containing a list of all form properties for the given categories
 */
export function flattenFormProperties(categories) {
  if (!categories) return [];
  const properties = categories.map(category => category.formProperties);
  return properties.flat();
}

/**
 * We always want to show a category when we are editing the form  
 * We always want to show a category when it has no display condition
 * We can only display a category when its groupingId in displayCondition matches the value in the matching property
 * Otherwise we just dont display a category
 * @param {object} category
 * @param {[object]} properties
 * @param {boolean} editMode
 * @returns {Boolean}
 */
export function checkCondition(category, properties, editMode) {
  if (editMode) {
    return true;
  }
  if (!category.displayCondition?.groupingId) {
    return true;
  }
  const property = properties.find(prop => prop.form_property_id === category.displayCondition.groupingId);
  const value = typeof property?.value === 'object' ? property?.value.checked : property?.value
  if (
    property &&
    eval(
      dompurify.sanitize(
        `"${value}" ${category.displayCondition.condition} "${category.displayCondition.value}"`
      )
    )
  ) {
    return true;
  }
  return false;
}

/**
 *
 * @param {object} formProperties
 * @description removes the field name from a property so focus on groupingId and value
 * @returns {[object]}
 */
export function extractValidFormPropertyValue(formProperties) {
  if(!Object.keys(formProperties).length) return []
  return Object.entries(formProperties)
    .map(([, value]) => value)
    .filter(item => item.value && item.value?.checked !== null && item.form_property_id !== null);
}
