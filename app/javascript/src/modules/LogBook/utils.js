/* eslint-disable import/prefer-default-export */

export function checkInValidRequiredFields(formData, requiredFields) {
  const values = requiredFields.map(field => formData[String(field)]);

  return values.some(isNotValidCheck);
}

export function isNotValidCheck(element) {
  return !element;
}

export const defaultRequiredFields= ['name', 'phoneNumber', 'nrc', 'vehiclePlate', 'reason']
