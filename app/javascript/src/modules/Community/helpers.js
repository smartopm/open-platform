/* eslint-disable import/prefer-default-export */

/**
 *  Checks if the theme color is a valid hexadecimal code
 * @param {String} primaryColor 
 * @param {String} secondaryColor 
 * @returns Boolean
 */
export function validateThemeColor({ primaryColor, secondaryColor }){ 
    return  /^#[0-9A-F]{6}$/i.test(primaryColor && secondaryColor)
}