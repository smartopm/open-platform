/* eslint-disable */
import dompurify from 'dompurify';

// keep string methods [helpers]

/**
 * 
 * @param {String} text
 * @returns a purifed link
 * @description receives a url and returns a purified url
 */
export function sanitizeText(text) {
  return dompurify.sanitize(text)
}

/**
 * 
 * @param {String} msg
 * @returns a stringified link or mailto link
 * @description find email addresses and urls in a message and replace them with links
 */
export function findLinkAndReplace(msg) {
  if (!msg) return
  const urlRegex = new RegExp(/(https?:\/\/[^\s]+)|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g)
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g
  return msg.replace(urlRegex, function (url) {
    if (emailRegex.test(url)) {
      return `<a href="mailto:${url}">${url}</a>`
    }
    return `<a href="${url}" >${url}</a>`
  })
}

/**
 * 
 * @param {String} message 
 * @param {Number} count
 * @description returns a substring of the given message after the character count passed to the function
 */
export function truncateString(message, count) {
  if (!message) return
  if (message.length <= count) return message
  return `${message.substring(0, count)}...`
}

/**
 * 
 * @param {string} word string to be uppercased
 * @description makes the first letter of a string to uppercase
 */
export function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
const cleanedFields = {
  userType: 'User Type',
  phoneNumber: 'Phone Number',
  name: 'name',
  email: 'email'
}

/**
 *
 * @param {String} requiredFields
 * @param {String} errorMessage
 * @returns a more readable error
 * @description Gets GraphQL errors and return a minimal human readable error
 *
 */
export function saniteError(requiredFields, errorMessage) {
  
  if (!errorMessage.length) return;
  const errArr = errorMessage.split(" ");
  const foundFields = requiredFields.filter(field => errArr.includes(field));
  const cleanFields = foundFields.map(field => cleanedFields[field])
  // duplicate errors are already sanitized, we just need to remove the GraphQL
  if (errArr.includes("Duplicate")) {
    return `${errorMessage.replace(/GraphQL error:/, "")}`;
  }
  // if we don't know the error
  if (!foundFields.length) {
    return "Unexpected error happened, Please try again";
  }
  return `${cleanFields.join(" or ")} value is blank`;
}

export function delimitorFormator(params) {
  return params.split('\n').join(',').split(',')
}

/**
* @param {String} text
* @returns copied text in the clipboard
*/
export function copyText(text) {
    if (text) return navigator.clipboard.writeText(text)
  }


  /**
 *
 * @param {Array} cords
 * @param {Number} initial  index to move from
 * @param {Number} final  index to move to
 * @description return new array with changed index positions
 * @tutorial check docs here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
 * @returns {[Number]}
 */
export function invertArray(cords, initial, final) {
  if (!Array.isArray(cords) || typeof initial !== 'number' || typeof final !== 'number' ) {
    throw new Error('You must provide proper values')
  }
  const initialElement = cords[initial]
  cords.splice(initial, 1)
  cords.splice(final, 0, initialElement)
  return cords
}

/**
 * 
 * @param {string} imageLink 
 * @description check if the link is an http if not it replaces it with https(mostly for facebook profile pics)
 * @returns {string} link
 */
export function forceLinkHttps(imageLink) {
  if(!imageLink) return
  const lkReg = /^https:\/\//i
  const link = !lkReg.test(imageLink) ? imageLink.replace('http', 'https') : imageLink
  return link
}

/**
 * @description so you have an array with objects and plains strings [{name: "joe"}, "danop"]
  and you want to merge names from the objects and strings
 * @param {[string]} labels - an array of all labels to merge, usually from server and local state
 * @returns [string]
 */
export function getJustLabels(labels) {
  if(!labels.length) return []
  let str = []
  for (let index = 0; index < labels.length; index++) {
    const element = labels[index]
    if (typeof element === 'object') {
      str.push(element.shortDesc)
    }
    str.push(element)
  }
  return str.filter(el => typeof el === 'string')
}

 /** 
 * @param {string} email 
 * @description check if email is valid
 * @returns {boolean} true or false
 */
export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}
