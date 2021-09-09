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
  const value = typeof property?.value === 'object' ? property?.value?.checked : property?.value
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
    .map(([, prop]) => {
      if(prop.type === 'checkbox') {
        return {
          value: Object.keys(prop.value).join(', '),
          form_property_id: prop.form_property_id,
        }
      }
      return prop
    })
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
    .map(([key, prop]) => {
      if(prop.type === 'checkbox') {
        return {
          value: Object.entries(prop.value).map(([k, val]) => val ? k : null).filter(Boolean).join(', '),
          fieldName: key,
        }
      }
      return {fieldName: key, value: prop.value?.checked || prop.value}
    })
    .filter(nonNullValues);
}


/**
 * gets a markdown text and a list of formproperties with their values and finds variables that matches
 * the fieldname and replaces its actual value from the about to be submitted form property.
 * @param {string} renderedText
 * @param {[object]} data
 * @returns {string}
 */
export function parseRenderedText(categories, data) {
  if(!categories) return ''
  const properties = extractValidFormPropertyFieldNames(data)
  const renderedText = extractRenderedTextFromCategory(data, categories)
  const words = renderedText.split(' ');
  return words
    .map((word) => {
      const wordToReplace = word.split('_').join(' ')
      const formProperty = properties.find((prop) => {
        return prop.fieldName?.toLowerCase().trim() === wordToReplace.replace(/\n|#/gi, '').replace(/[,.]/, '').toLowerCase()
      });
      if (formProperty) {
        return word.replace(/#(\w+)/i, formProperty.value)
      }
      return word;
    })
    .join(' ');
}


/**
 * Ensure we only show contract preview for currently enabled categories in this form
 * @param {[object]} formProperties 
 * @param {[object]} categoriesData 
 * @returns {string}
 */
export function extractRenderedTextFromCategory(formProperties, categoriesData){
  if(!categoriesData) return ''
  const properties = extractValidFormPropertyValue(formProperties)
  const validCategories = categoriesData.filter(category => checkCondition(category, properties, false))
  const text = validCategories.map(category => `${category.renderedText}  `).join('');
  return text
}

/**
 * Validates required fields
 * @param {[object]} filledInProperties
 * @param {[object]} formData
 * @returns {Boolean}
 */
export function requiredFieldIsEmpty(filledInProperties, formData) {
  let result = false
  const valid = formData.filter(category => checkCondition(category, filledInProperties, false))

  // TODO: This could use some optimization
  // eslint-disable-next-line no-restricted-syntax
  for (const category of valid) {
    // eslint-disable-next-line no-restricted-syntax
    for (const form of category.formProperties) {
      if (form.required && !filledInProperties.find(filled => form.id === filled.form_property_id)?.value) {
        result = true;
        break;
      }
    }
  }
  return result
}