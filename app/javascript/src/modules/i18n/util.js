/* eslint-disable import/prefer-default-export */
export const getCurrentLng = () => {
    const currentlang =  window.localStorage['default-language'] || 'en-US'
    return currentlang
};


