// keep string methods [helpers]

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
    return `<a href="${url}">${url}</a>`
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
 * @param {String} requiredFields
 * @param {String} errorMessage
 * @returns a more readable error
 * @description Gets GraphQL errors and return a minimal human readable error
 *
 */
export function saniteError(requiredFields, errorMessage) {
  if (!errorMessage.length) return;
  const errArr = errorMessage.split(" ");
  const foundFields = Object.keys(requiredFields).filter(field => errArr.includes(field));
  // duplicate errors are already sanitized, we just need to remove the GraphQL
  if (errArr.includes("Duplicate")) {
    return `${errorMessage.replace(/GraphQL error:/, "")}`;
  }
  // if we don't know the error
  if (!foundFields.length) {
    return "Unexpected error happened, Please try again";
  }
  return `${foundFields.join(" or ")} value is blank`;
}
