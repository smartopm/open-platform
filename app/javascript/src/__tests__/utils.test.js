import { findLinkAndReplace, truncateString, saniteError } from '../utils/helpers'

const message = "Please share your feedback with this 30 seconds survey: https://app.doublegdp.com/news/posts/survey/"
const messageWithEmail = `Please share your feedback with this 30 seconds survey ekosurveyyo.crb@outlook.com
                         Juilie  Juiliebosbsd@gmail.com https://double-gdp-staging.herokuapp.com/
                        denisharelan@yahoo.com https://dev.dgdp.site/users`
const simpleMsgEmail = "Please share this email Juiliebosbsd@gmail.com"
const count = 40

// example errors
const allFieldsError = `GraphQL error: name of type String! was provided invalid value GraphQL error: 
                        Variable phoneNumber of type String! was provided invalid value GraphQL error: 
                        Variable userType of type String! was provided invalid value`

const duplicateError = "GraphQL error: Duplicate Email"

const fieldError = "GraphQL error: userType of type String! was provided invalid value"
const requiredKeys = {
  userType: "User Type",
  phoneNumber: "Phone Number",
  name: "name",
  email: "email"
};




describe('find links and replace with anchor tag', () => {
  // find link in a text and replace

  it('should find link and replace it with anchor tag', () => {
    expect(findLinkAndReplace(message, count)).toContain('<a href')
  })
  it('should return nothing when no message is provided', () => {
    expect(findLinkAndReplace()).toBe(undefined)
  })
  it('should find email addresses', () => {
    expect(findLinkAndReplace(simpleMsgEmail)).toContain('mailto')
  })
  it('should find emails in a longer message', () => {
    expect(findLinkAndReplace(messageWithEmail)).toContain(
      '<a href="mailto:denisharelan@yahoo.com">denisharelan@yahoo.com</a>'
    )
  })
})

describe('truncate messages', () => {
  it('should find link and replace it with anchor tag', () => {
    expect(truncateString(message, count)).toBe(
      'Please share your feedback with this 30 ...'
    )
  })
  it('should return undefined when no params is given', () => {
    expect(truncateString()).toBe(undefined)
  })
})

describe('sanitize GraphQL errors', () => {
  // check for empty error
  it('should return null when no error is given', () => {
    expect(saniteError(requiredKeys, '')).toBeUndefined()
  })

  // check for duplicates
  it('should clean and return duplicate error where there is duplicate', () => {
    expect(saniteError(requiredKeys, duplicateError)).toBe(' Duplicate Email')
  })

  // check for one field missing
  it('should return cleaned error when one field is missing', () => {
    expect(saniteError(requiredKeys, fieldError)).toBe(
      "userType value is blank"
    )
  })

  // check for multiple fields missing
  it('should return cleaned error when multiple fields are missing', () => {
    expect(saniteError(requiredKeys, allFieldsError)).toBe(
      "userType or phoneNumber or name value is blank"
    )
  })
})
