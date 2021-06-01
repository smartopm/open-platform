/* eslint-disable import/prefer-default-export */

/**
 *  Checks if the theme color is a valid hexadecimal code
 * @param {String} primaryColor 
 * @param {String} secondaryColor 
 * @returns Boolean
 */
export function validateThemeColor({ primaryColor, secondaryColor }){
    const re = /^#[0-9A-F]{6}$/i
    if (!re.test(primaryColor) || !re.test(secondaryColor)) {
        return false
    }
    return  true
}