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
 * @param {string} propId
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
 * @returns {boolean}
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
 * check if a given item has a value or a form_property_id
 * This is used to check fields that values before submitting a form
 * @param {object} item
 * @returns {boolean}
 */
export function nonNullValues(item){
  return item.value && item.value?.checked !== null && item.form_property_id !== null
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
    .filter(nonNullValues);
}

/**
 * This focuses on field names which extractValidFormPropertyValue lacks,
 * we could've done both under one function but when submitting a form GraphQL test complain because of unmatching args
 * @param {object} formProperties
 * @returns [{object}]
 */
export function extractValidFormPropertyFieldNames(formProperties) {
  if(!Object.keys(formProperties).length) return []
  return Object.entries(formProperties)
    .map(([key, prop]) => ({fieldName: key, value: prop.value?.checked || prop.value}))
    .filter(nonNullValues);
}


/**
 * gets a markdown text and a list of formproperties with their values and finds variables that matches
 * the fieldname and replaces its actual value from the about to be submitted form property.
 * @param {string} renderedText
 * @param {[object]} data
 * @returns {string}
 */
export function parseRenderedText(renderedText, data) {
  const properties = extractValidFormPropertyFieldNames(data)
  const words = renderedText.split(' ');
  return words
    .map((word) => {
      const formProperty = properties.find(
        (prop) => prop.fieldName === word.replace(/\n|#/g, '')
      );
      if (formProperty) {
        return word.replace(/#[A-Za-z0-9]+/, formProperty.value);
      }
      return word;
    })
    .join(' ');
}

/**
 * Validates required fields
 * @param {[object]} filledInProperties
 * @param {[object]} formData
 * @returns {Boolean}
 */
export function requiredFieldIsEmpty(filledInProperties, formData) {
  let result = false
  // eslint-disable-next-line no-restricted-syntax
  for (const form of formData) {
    if (form.required && !filledInProperties.find(filled => form.id === filled.form_property_id)?.value) {
      result = true;
      break;
    }
  }
  return result
}