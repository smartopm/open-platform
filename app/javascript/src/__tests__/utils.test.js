import { findLinkAndReplace, truncateString } from '../utils/helpers'

const message = "Please share your feedback with this 30 seconds survey: https://app.doublegdp.com/news/posts/survey/"
const messageWithEmail = `Please share your feedback with this 30 seconds survey ekosurveyyo.crb@outlook.com
                         Juilie  Juiliebosbsd@gmail.com https://double-gdp-staging.herokuapp.com/
                        denisharelan@yahoo.com https://dev.dgdp.site/users`
const simpleMsgEmail = "Please share this email Juiliebosbsd@gmail.com"
const count = 40

describe('find links and replace with anchor tag', () => {
    // find link in a text and replace

    it('should find link and replace it with anchor tag', () => {
        expect(findLinkAndReplace(message, count)).toContain('<a href')
    })
    it('should return nothing when no message is provided', () => {
        expect(findLinkAndReplace()).toBe(undefined)
    });
    it('should find email addresses', () => {
        expect(findLinkAndReplace(simpleMsgEmail)).toContain('mailto')
    })
    it('should find emails in a longer message', () => {
        expect(findLinkAndReplace(messageWithEmail)).toContain('<a href="mailto:denisharelan@yahoo.com">denisharelan@yahoo.com</a>')
    })
})

describe('truncate messages', () => {
    it('should find link and replace it with anchor tag', () => {
        expect(truncateString(message, count)).toBe('Please share your feedback with this 30 ...')
    })
    it('should return undefined when no params is given',  () => {
        expect(truncateString()).toBe(undefined)
    });
})