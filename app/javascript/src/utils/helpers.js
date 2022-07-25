/* eslint-disable */
import React from 'react';
import dompurify from 'dompurify';
import { useLocation } from 'react-router';
import { dateToString } from '../components/DateContainer';
import { jsPDF as JsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';


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
export function formatError(errMsg="") {
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
  const urlRegex = /(https?:\/\/[^\s]+)|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g
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
  const errArr = errorMessage.replace(/\$/, '').split(" ");
  const foundFields = requiredFields.filter(field => errArr.includes(field));
  const cleanFields = foundFields.map(field => cleanedFields[field])
  // If required field(s) is missing
  if(foundFields.length > 0){
    return `${cleanFields.join(" or ")} value is required`;
  }
  // if we don't know the error
  if (!errorMessage.includes("GraphQL error")) {
    return "Unexpected error happened, Please try again";
  }

  return `${errorMessage.replace(/GraphQL error:/, "")}`;
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
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
  if (!string) return
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
  if (action === 'Task') {
    return `Create ${action}`
  }

  return  `Send ${action}`
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
    if (field1.formProperty.order === field2.formProperty.order) {
      if (field1.formProperty.id > field2.formProperty.id) return -1; else return 1;
    }
    return Number(field1.formProperty.order) - Number(field2.formProperty.order)
  }

  if (field1.order === field2.order) {
    if (field1.id > field2.id) return -1; else return 1;
  }
  return Number(field1.order) - Number(field2.order)
}

export function useParamsQuery() {
  return new URLSearchParams(useLocation().search)
}

export const InvoiceStatusColor = {
  inProgress: '#3493FB',
  paid: '#66A69B',
  late: '#E79040',
  cancelled: '#E74540',
  in_progress: '#3493FB',
  active: '#00A98B',
  in_active: '#E74540'
}

export const InvoiceType = {
  cash: 'Cash',
  'cheque/cashier_cheque': 'Cheque/CashierCheque'
}

export function generateId() {
  if (!window.crypto) {
    return ['233b1634', 'bf08', '4ece', 'a213', 'b3f120a', '1e008', 'sdfsdfsdfsdfwerfwe', 1, 23, 4]
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
 * @param {object} object
 * @param {String} key
 * @description gets a value out of an object or an array purposely to reduce the "Code Injection" vulnerabilities
 */
export function objectAccessor(object, key) {
  if (!object) return
  return object[key]
}

/**
 *
 * @param {object} object
 * @param {String} key
 * @param {String} value
 * @description set a value in object or an array purposely to reduce the "Code Injection" vulnerabilities
 */
export function setObjectValue(object, key, value) {
	object[key] = value
	return object
}

/**
 *
 * @param {String} str snake_case string
 * @return {String} camelCase string
 * @description converts a snake_case string to a camelCase by finding words that start with _ or -
 * and replaces this with a titlecased word after the _ or - since the regex is global,
 * it applies this to all instances
 * @example snake_name ==> snakeName
 */
export function toCamelCase(str){
  return str.replace(/([-_]\w)/g, word => word[1].toUpperCase());
}

/**
 *
 * @param {String} str snake_case string
 * @return {String} titleCase string
 * @description converts a snake_case string to a titleCase by finding First character of word.
 * @example snake_name ==> Snake Name
 */
export function toTitleCase(str) {
  if (str === null || str === undefined) return;

  return str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)|'/g, s => s.toUpperCase());
}
/**
 *
 * @param {Number} range integer number
 * @return {String} Hex color based on number range
 * @description Converts a number range to HEX color used for map map legend
 */
/* eslint-disable no-nested-ternary */
export function getHexColor (range) {
  return (range > 320
    ? '#E8E8E8'
    : range > 270
    ? '#E8E8E8'
    : range > 220
    ? '#F8F0E3'
    : range > 170
    ? '#F8F0E3'
    : range > 120
    ? '#F8F0E3'
    : range > 20
    ? '#F8F0E3'
    : range > 10
    ? '#F8F0E3'
    : '#F8F0E3'
  )
}

/**
 * @description format numbers in browser depending on the user's community
 * @param {object} currencyData locale and currency
 * @param {Number} amount
 * @returns {String} formatted amount in user's locale
 */

 export function formatMoney(currencyData, amount) {
  if (process.env.NODE_ENV === "test") return `K ${amount}`;

  const formatted = new Intl.NumberFormat(currencyData?.locale || 'en-ZM', {
    style: 'currency',
    currency: currencyData?.currency,
  })?.format(amount);
  return formatted;
  return 10
 }

 /**
  *
  * @param {object} currencyData currency and locale
  * @description it gets the currency from the locale, so instead of USD or ZMW, it gives $ or K
  */
 export function extractCurrency(currencyData) {
  if(process.env.NODE_ENV !== "test"){
    const parts = new Intl.NumberFormat(currencyData?.locale || 'en-ZM', {
      style: 'currency',
      currency: currencyData?.currency
    })?.formatToParts();
    return parts[0]?.value;
  }
 }

 /**
 *
 * @param {object} featureGroup leaflet map layer
 * @return {object} plugin config
 * @description Creates a plugin config for leaflet draw control
 */
export function getDrawPluginOptions (featureGroup) {
  return ({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Oh snap!<strong> you can\'t draw that!'
          },
          shapeOptions: {
            color: '#97009c'
          }
        },
        // disable toolbar item by setting it to false
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
        },
      edit: {
        featureGroup,
        remove: true
      }
    })
}

/**
 *
 * @param {object} Onchange function on filter
 * @return {object} Query
 * @description Handles the onchange for filter
 */

export function handleQueryOnChange(selectedOptions, filterFields) {
  if (selectedOptions) {
    const andConjugate = selectedOptions.logic?.and
    const orConjugate = selectedOptions.logic?.or
    const availableConjugate = andConjugate || orConjugate
    const dateFields = [
      'created_at',
      'due_date',
      'ends_at',
      'visit_end_date'
    ];
    if (availableConjugate) {
      const conjugate = andConjugate ? 'AND' : 'OR'
      const query = availableConjugate
        .map(option => {
          let operator = Object.keys(option)[0]
          const property = operator === '<=' ? filterFields[option[operator][1].var] : filterFields[option[operator][0].var];
          let value = objectAccessor(option, operator)[1]

          if(dateFields.includes(property) && operator === '<=') {
            const start_date = formatDateFields(property, objectAccessor(option, operator)[0])
            const end_date = formatDateFields(property, objectAccessor(option, operator)[2])

            return `${property} >= "${start_date}" AND ${property} <= "${end_date}"`
          }
          if (operator === '==') operator = ':'
          if (dateFields.includes(property)) {
            value = formatDateFields(property, value);
          }

          return `${property} ${operator} '${value}'`
        })
        .join(` ${conjugate} `)
      return query
    }
  }
}

export function formatDateFields(property, value) {
  if (property === 'ends_at') {
    value = dateToString(value, 'YYYY-MM-DD HH:mm');
  } else {
    value = dateToString(value);
  }
  return value;
};

/**
 *
 * @param {[String]} features
 * @param {String} module
 * @returns Boolean
 * @description checks if a module is in accepted features of a community
 */
export function checkAllowedCommunityFeatures(features, module){
  if(!features || !module) return false
  const featureList = Object.keys(features)

  if (!featureList.length) return false
  return new Set(featureList).has(module)
}

/**
 *
 * @param {object} { userTypes, ctx: context }
 * @returns {array} list of permitted user types
 * @description include or exclude user type from menu accessibility list
 * @default {array} original user types when context is undefined
 */
 export function checkAccessibilityForUserType({ userTypes, ctx }){
   // prefer original accessibility when no ctx
   if(!ctx){
    return userTypes;
   }

   // allow accessibility for admin
  if(ctx.userType && ctx.userType.includes('admin')){
    return userTypes;
  }

  // on payment check, allow accessibility for user type
  if(ctx.paymentCheck && ctx.userType){
    // deny accessibility without payment plan
    if(!ctx.loggedInUserPaymentPlan){
      return (userTypes.filter(t => t !== ctx.userType));
    }

    return userTypes;
  }

  // allow accessibility for self
  if(ctx.userId && ctx.loggedInUserId && ctx.userId === ctx.loggedInUserId) {
    return userTypes;
  }

  // deny accessibility for user type
  return (userTypes.filter(t => t !== ctx.userType));
}

/**
 * extract country abreviation from community locale
 * @param {String} locale of format en-Uk
 * @returns small letter country abreviation like uk, us, ng
 */
export function extractCountry(locale){
  // if the locale is wrongly formatted then return the default locale
  if(!locale || !locale.includes('-')) return 'zm'
  return locale.split('-')[1].toLowerCase()
}


export function ifNotTest(){
  return process.env.NODE_ENV !== 'test'
}


export function secureFileDownload(path) {
  const link = document.createElement('a');
  link.setAttribute('href', path);
  link.setAttribute('download', '');
  link.setAttribute('target', '_blank');
  link.onclick = function(e) { e.preventDefault(); window.open(path, '_blank'); link.click(); };
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * split camelCase words
 * @param {String} camelCase word
 * @returns split words
 */
 export function splitCamelCase(word){
  return word.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function sortTaskOrder(taskItem1, taskItem2){
  if(!taskItem1 || !taskItem2) return;

  return (
    Number(taskItem1.order) - Number(taskItem2.order)
  );
}

export function extractHostname(urlString) {
  if (!urlString) return;
  return {
    hostname: urlString.split('/')[2],
    userId: urlString.split('/')[4]
  }
}

/**
 * Get a key from an object, given the object and value of the corresponding key.
 * @param {Object} obj object
 * @param {String} option word
 * @returns key for a value, if such value exists or undefined otherwise.
 */
export function getObjectKey(obj, option) {
  return Object.keys(obj).find(key => objectAccessor(obj, key) === option);
}

/**
 * @param {String} str a word or sentence consisting of
 * HTML special character (in form of entity number )
 * @returns decoded readable special character or symbol
 */
export function decodeHtmlEntity(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

export function replaceDocumentMentions(comment, onDocClick) {
  const text = comment?.body;
  if (!text) return;
  if (!onDocClick) return text;

  const formattedText = text
    .trim()
    .split(/(###.*?###)/)
    .map((word, index) => {
      if (/\###(.*?)\###/.test(word)) {
        const documentId = word.split('__')[1];
        const linkOptions = { key: index, href: '#' };
        linkOptions['onClick'] = e => {
          e.preventDefault();
          onDocClick(comment, documentId);
        };

        return React.createElement('a', linkOptions, word.split('__')[2]);
      }
      return React.createElement('span', { key: index }, word);
    });

  return React.createElement('div', {}, formattedText);
}

/**
 * Captures a page screenshot and convert to pdf,
 * handles multiple pages
 * @param {NodeElement} domElement the DOM container to captured
 * @param {String} docName what to name the pdf document
 */
export function savePdf(domElement, docName = 'download') {
  html2canvas(domElement).then(canvas => {
    const img = canvas.toDataURL('image/jpeg');
    const pdf = new JsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    const imgWidth = 190; //a4 has 210mm, we used 190mm so as to leave space to left/right
    const pageHeight = 270; // a4 has 297mm height, we used 270mm to leave space on top of page-1
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(img, 'JPEG', 10, 15, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(img, 'JPEG', 10, position + 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`${docName}.pdf`);
  }).catch((error) => { return error });
}

/**
 * Check if required fields are satisfied and return an error with a helper text
 * @param {String} fieldName
 * @param {{isError: Boolean}} inputValidationMsg
 * @param {[String]} requiredFields
 * @returns {{ error: Boolean, helperText: String }}
 */
export function validateRequiredField(fieldName, inputValidationMsg={}, requiredFields=[], inputData={}, t) {
  const validationError =
    inputValidationMsg.isError &&
    requiredFields.includes(fieldName) &&
    !objectAccessor(inputData, fieldName);
  return {
    error: validationError,
    helperText: validationError
      ? t('form:errors.required_field', { fieldName })
      : t(`amenity:helper_text.${fieldName}`)
  };
}

/**
 * This converts a DOM element/container to a png image.
 * @param {DOMElement} currentRef is the current container to be converted to image
 * @param {String} name is the proposed name for the prepared image
 */
export function downloadAsImage(currentRef, name) {
  toPng(currentRef)
    .then(dataUrl => {
      const link = document.createElement('a');
      link.download = `${name.replace(/ /g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch(() => { return { error: true };
    });
}

export function downloadCommentFile(comment, fileId) {
  const clickedDoc = comment?.taggedAttachments.find(doc => doc.id === fileId);
  secureFileDownload(clickedDoc.url);
}

/**
 * A simple function that auto scroll to top of page
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}