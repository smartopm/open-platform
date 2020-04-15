import { findLinkAndReplace, truncateString } from '../utils/helpers'

const message = "Please share your feedback with this 30 seconds survey: https://app.doublegdp.com/news/posts/survey/"
const count = 40
describe('find links and replace with anchor tag', () => {
    // find link in a text and replace

    it('should find link and replace it with anchor tag', () => {
        expect(findLinkAndReplace(message, count)).toContain('<a href')
    })
    it('should return nothing when no message is provided', () => {
        expect(findLinkAndReplace()).toBe(undefined)
    });
})

describe('truncate messages', () => {
    it('should find link and replace it with anchor tag', () => {
        expect(truncateString(message, count)).toBe('Please share your feedback with this 30 ...')
    })
    it('should return undefined when no params is given',  () => {
        expect(truncateString()).toBe(undefined)
    });
})