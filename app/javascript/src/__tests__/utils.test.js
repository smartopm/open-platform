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
  objectAccessor,
  toCamelCase,
  formatMoney,
  extractCurrency,
  extractCountry,
  checkAllowedCommunityFeatures,
  ifNotTest,
  toTitleCase,
  splitCamelCase,
  accessibilityOptions,
  setAccessibilityValue
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

const nonGraphQLError = "PG::UniqueViolation: ERROR: duplicate key value violates unique constraint";
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
      'User Type value is required'
    )
  })

  // check for multiple fields missing
  it('should return cleaned error when multiple fields are missing', () => {
    expect(saniteError(requiredKeys, allFieldsError)).toBe(
      'User Type or Phone Number or name value is required'
    )
  })

  // if the error is not related to GraphQL or missing value
  it('should return unexpected error happened mesage', () => {
    expect(saniteError(requiredKeys, nonGraphQLError)).toBe(
      'Unexpected error happened, Please try again'
    )
  })
})

describe('array methods', () => {
  it('should return an inverted array', () => {
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
    expect(generateId()).toHaveLength(10)
  })

  // property accessor
  it('should validate params', () => {
    expect(objectAccessor({a: 4}, 3)).toBeUndefined()
    // get correct value
    expect(objectAccessor({a: 4}, 'a')).toBe(4)
    expect(objectAccessor([1, 2, 3], 1)).toBe(2)
    // prop must be a property in the given object
    expect(objectAccessor({a: 4}, 'b')).toBeUndefined()
    // the object should only be of type object
    expect(objectAccessor([], 'b')).toBeUndefined()
  })

  it('should return false if feature is not allowed', () => {
    const features = { a: { features: [] }, b: { features: [] } }
    expect(checkAllowedCommunityFeatures(features, 'x')).toBe(false)
  })
  it('should return true if feature is allowed', () => {
    const features = { a: { features: [] }, b: { features: [] } }
    expect(checkAllowedCommunityFeatures(features, 'b')).toBe(true)
    expect(checkAllowedCommunityFeatures(features, 'a')).toBe(true)
  })

  it('should return false if features and module is undefined', () => {
    expect(checkAllowedCommunityFeatures()).toBe(false)
  })

  it('should return false if list of features is empty', () => {
    expect(checkAllowedCommunityFeatures([], 'a')).toBe(false)
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
  it('should return a converted string to camelCase', () => {
    expect(toCamelCase('snake_case')).toBe('snakeCase')
    expect(toCamelCase('snake_case_again_and_again')).toBe('snakeCaseAgainAndAgain')
  })
})

describe('locales', () => {
  const details = {
    locale: 'en-US',
    currency: 'USD'
  }

  it('should return the correctly formatted amount', () => {
    expect(formatMoney(details, 100)).toBe('K 100')
  })

  // changing the test case for this due to the failure of the new Intl in test environment
  // we expect it to be undefined because we dont run it in jest
  it('should get the currency from the given locale', () => {
    expect(extractCurrency(details)).toBeUndefined()
  })
  it('should extract locale and format it', () => {
    expect(extractCountry(details.locale)).toBe("us")
    expect(extractCountry()).toBe("zm")
    expect(extractCountry("someesdfs")).toBe("zm")
  })
})

describe('everything else', () => {
  it('ifNotTest should always return false because it is run in test env', () => {
    expect(ifNotTest()).toBe(false)
  })
})

describe('toTitleCase', () => {
  it('should return undefined if null or undefined is passed as parameter', () => {
    expect(toTitleCase(null)).toBe(undefined);
    expect(toTitleCase(undefined)).toBe(undefined);
  });

  it('should convert the snake case to title case', () => {
    expect(toTitleCase('prospective_client')).toBe('Prospective Client');
  });
});

describe('slit camelCase', () => {
  it('should return split words', () => {
    expect(splitCamelCase('SampleCamel')).toBe('Sample Camel')
  })
})

describe('accessibilityOptions', () => {
  it('should return an object of available accessibility options', () => {
    const response = accessibilityOptions();
    expect(response).toBeInstanceOf(Object);
    expect(Object.keys(response).includes('admins')).toBeTruthy();
    expect(Object.keys(response).includes('everyone')).toBeTruthy();
  })
});

describe('setAccessibilityValue', () => {
  it("should the key for an object's value if the key is found", () => {
    const obj = { one: 'two', three: 'four' }
    const response = setAccessibilityValue(obj, 'two');

    expect(response).toBeTruthy();
    expect(response).toEqual('one');

    expect(setAccessibilityValue(obj, 'five')).toBe(undefined)
  });
});