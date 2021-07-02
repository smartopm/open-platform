/* eslint-disable import/prefer-default-export */




export function checkInValidRequiredFields(formData, requiredFields) {
  const values = requiredFields.map(field => formData[String(field)]);

  function isNotValid(element) {
    return !element;
  }

  return values.some(isNotValid);
}

export const defaultRequiredFields= ['name', 'phoneNumber', 'nrc', 'vehiclePlate', 'reason']
