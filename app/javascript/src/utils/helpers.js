/* eslint-disable */
import dompurify from 'dompurify';
import { useLocation } from 'react-router';

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
 * @param {String} errMsg
 * @returns a string without the Graphql part
 * @description receives an error message and returns a a message without the graphql part
 */
export function formatError(errMsg) {
  return errMsg.split(":").pop()
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
 * @param {String} str
 * @returns a booleen if string has html tags
 * @description check if a string contains html tags and return a boolean
 */
export function checkForHtmlTags(str) {
  if (!str) return
  const result = /<\/?[a-z][\s\S]*>/i.test(str)
  return result
}

/**
 *
 * @param {String} str
 * @returns a string
 * @description removes new lines and line break from a string
 */
export function removeNewLines(str) {
  if (!str) return
  const result = str.replace(/(\r\n|\n|\r)/gm, "")
  return result
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


/**
 *
 * @param {String} word
 * @returns {String}
 * @description makes the first letter of the word capital
 */
export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

 /**
 * @param {Number} count
 * @param {String} noun
 * @param {String} [suffix=s]
 * @description pluralize count message
 * @returns {String}
 */
export function pluralizeCount(count, noun, suffix = 's') {
  return `${noun}${count > 1 ? suffix : ''}`
}

 /**
 * @param {String} string
 * @description just like Ruby titleize
 * @returns {String}
 */
export function titleize(string) {
  var words = string.split(/-|_/)
  return words.map(function(word) {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
  }).join(' ')
}

/**
 * @param {String} action
 * @description return the sentence form for ActionFlow actions
 * @returns {String}
 */
export function sentencizeAction(action){
  const sendActions = ['email', 'notification']
  const createActions = ['task']

  if(sendActions.indexOf(action.toLowerCase()) >= 0) {
    return `Send ${action}`
  }

  if(createActions.indexOf(action.toLowerCase()) >= 0) {
    return `Create ${action}`
  }
}


export async function convertBase64ToFile(data){
  const res = await fetch(data)
  const blob = await res.blob()
  // will pass in file name 
  const file = new File([blob], "File name", { type: "image/png" })
  return file
}

/**
 * 
 * @param {Object} field1 
 * @param {Object} field2 
 * @returns order
 */
export function sortPropertyOrder(field1, field2){
  if(!field1 || !field2) return
  if(field1.formProperty) {
    return Number(field1.formProperty.order) - Number(field2.formProperty.order)
  }
  return Number(field1.order) - Number(field2.order)
}

export function useParamsQuery() {
  return new URLSearchParams(useLocation().search)
}


export const InvoiceStatus = {
  inProgress: 'In-Progress',
  paid: 'Paid',
  late: 'Late',
  cancelled: 'Cancelled',
  in_progress: 'In-Progress',
}

export function generateId() {
  if (!window.crypto) {
    return ['233b1634-bf08-4ece-a213-b3f120a1e008', 'sdfsdfsdfsdfwerfwe']
  }
  const array = new Uint32Array(10)
  return window.crypto.getRandomValues(array)
}

/**
 *
 * @param {JSON} str
 * @returns true if string is valid json || false
 * @description check if a string is a valid json || geoJSON
 */
export function checkValidGeoJSON(str){
  try {
    const o = JSON.parse(str)
    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object", 
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return true;
    }
    } catch (e) {
      return false;
    }
  }

/**
 * 
 * @param {Object} obj 
 * @param {String} prop 
 * @description get value based on a passed property name, if validates object and string first
 */
  export function propAccessor(obj, prop){
    // check if the given prop is a string
    if(typeof prop !== 'string') return
    // check if obj is a valid object
    // I couldn't find a better way of validating am object
    if(Object.prototype.toString.call(obj) !== '[object Object]') return 
    // check if prop is in obj
    if(!obj.hasOwnProperty(prop)) return
    for (const [key, value] of Object.entries(obj)) {
        if(key === prop){
            return value
        }
    }
    
}