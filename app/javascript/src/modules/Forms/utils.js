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
   * @param {{}} properties
   * @param {String} propId
   * @description check form values that weren't filled in and add default values
   */
  export function addPropWithValue(properties, propId) {
    if (propExists(properties, propId)) {
      return;
    }
    properties.push({ value: null, form_property_id: propId });
  }
