/* eslint-disable import/prefer-default-export */

/**
 *  Checks if the theme color is a valid hexadecimal code
 * @param {String} primaryColor 
 * @param {String} secondaryColor 
 * @returns Boolean
 */
export function validateThemeColor({ primaryColor, secondaryColor }){ 
    if (!primaryColor.includes('#') || !secondaryColor.includes('#') ) {
        return false;
    }
    return true
}