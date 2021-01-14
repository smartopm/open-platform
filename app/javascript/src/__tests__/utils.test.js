import {
  findLinkAndReplace,
  truncateString,
  saniteError,
  invertArray,
  forceLinkHttps,
  getJustLabels,
  capitalize,
  pluralizeCount,
  checkForHtmlTags,
  removeNewLines,
  titleize,
  formatError,
  generateId,
  propAccessor
} from '../utils/helpers'

const message =
  'Please share your feedback with this 30 seconds survey: https://app.doublegdp.com/news/posts/survey/'
const messageWithEmail = `Please share your feedback with this 30 seconds survey ekosurveyyo.crb@outlook.com
                         Juilie  Juiliebosbsd@gmail.com https://double-gdp-staging.herokuapp.com/
                        denisharelan@yahoo.com https://dev.dgdp.site/users`
const simpleMsgEmail = 'Please share this email Juiliebosbsd@gmail.com'
const count = 40

// example errors
const allFieldsError = `GraphQL error: name of type String! was provided invalid value GraphQL error:
                        Variable phoneNumber of type String! was provided invalid value GraphQL error:
                        Variable userType of type String! was provided invalid value`

const duplicateError = 'GraphQL error: Duplicate Email'

const fieldError =
  'GraphQL error: userType of type String! was provided invalid value'
const requiredKeys = ['userType', 'phoneNumber', 'name', 'email']
const strWithTags =
  'New prospective client <a>Tolulope</a> visited Nkwashi site'
const strWitNewLines = 'This is a test\nstring'
const formatErrorMessage = 'Graghql: This an error'

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

describe('format error', () => {
  it('should return error message without the graphql part', () => {
    expect(formatError(formatErrorMessage)).toBe(' This an error')
  })
})

describe('Remove new lines', () => {
  it('should remove new line in a string', () => {
    expect(removeNewLines(strWitNewLines)).toBe('This is a teststring')
  })
})

describe('Check HTML tags', () => {
  it('should return true if html tags are present', () => {
    expect(checkForHtmlTags(strWithTags)).toBe(true)
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
      'User Type value is blank'
    )
  })

  // check for multiple fields missing
  it('should return cleaned error when multiple fields are missing', () => {
    expect(saniteError(requiredKeys, allFieldsError)).toBe(
      'User Type or Phone Number or name value is blank'
    )
  })
})

describe('array methods', () => {
  it('should return an inverted array ', () => {
    const arr = [1, 2, 3, 4, 5]
    const arr2 = [...arr] // since splice mutate the original array, good to copy for us to better tests other cases
    expect(invertArray(arr, 0, 1)).toStrictEqual([2, 1, 3, 4, 5])
    expect(invertArray(arr2, 1, 2)).toStrictEqual([1, 3, 2, 4, 5])
  })
  // links with http
  it('should replace http with https in links that are not secure', () => {
    const link = 'http://doubglegdp.com/some_image_link.jpg'
    const httpsLink = 'https://doubglegdp.com/some_https_image_link.jpg'
    expect(forceLinkHttps(link)).toBe(
      'https://doubglegdp.com/some_image_link.jpg'
    )
    expect(forceLinkHttps(httpsLink)).toBe(httpsLink)
  })
  // merge items
  it('should just pick label description despite some being in an object', () => {
    const labels = [
      { shortDesc: 'blue', id: '23' },
      'red',
      { shortDesc: 'green', id: '33' },
      'white'
    ]
    expect(getJustLabels(labels)).toStrictEqual([
      'blue',
      'red',
      'green',
      'white'
    ])
    expect(getJustLabels([])).toStrictEqual([])
  })
  it('capitalizes the first letter of the word', () => {
    expect(capitalize('testing')).toBe('Testing')
  })
  it('should generate random string', () => {
    expect(generateId()).toBeTruthy()
    expect(generateId()).toBeInstanceOf(Array)
  })

  // property accessor
  it('should validate params', () => {
    expect(propAccessor({a: 4}, 3)).toBeUndefined()
    // get correct value
    expect(propAccessor({a: 4}, 'a')).toBe(4)
    // prop must be a property in the given object
    expect(propAccessor({a: 4}, 'b')).toBeUndefined()
    // the object should only be of type object 
    expect(propAccessor([], 'b')).toBeUndefined()
  })
})

describe('pluralizeCount', () => {
  it("should add 's' if count is > 1", () => {
    expect(pluralizeCount(5, 'Point')).toBe('Points')
  })
  it("should not add 's' if count is not > 1", () => {
    expect(pluralizeCount(1, 'Point')).toBe('Point')
  })
  it('should use the provided suffix if available', () => {
    expect(pluralizeCount(5, 'Child', 'ren')).toBe('Children')
  })
})

describe('titleize', () => {
  it('Captilize each word and remove hyphens', () => {
    expect(titleize('artists-in-residence')).toBe('Artists In Residence')
  })
  it("should just capitalize if it's a single word", () => {
    expect(titleize('policy')).toBe('Policy')
  })
  it('should return as it is, if already ok', () => {
    expect(titleize('Posts')).toBe('Posts')
  })
})
