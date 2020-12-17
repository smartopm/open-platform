import dompurify from 'dompurify';

import { sentencizeAction, titleize, pluralizeCount, 
capitalize, validateEmail, invertArray,findLinkAndReplace,
forceLinkHttps, titleCase, truncateString, removeNewLines, checkForHtmlTags, sanitizeText, getJustLabels } from '../../utils/helpers'

jest.mock('dompurify')
describe('helper methods', () => {
    describe('#sentencizeAction', () => {
      it('should attach \'send\' to sendActions', () => {
        
        expect(sentencizeAction('email')).toMatch(/Send email/i);
        expect(sentencizeAction('notification')).toMatch(/Send notification/i);
      });
      it('should attach \'create\' to createActions', () => {
        expect(sentencizeAction('task')).toMatch(/Create task/i);
      });
      it('should not attach \'create\' to sendActions', () => {
        expect(sentencizeAction('email')).not.toMatch(/Create email/i);
        expect(sentencizeAction('notification')).not.toMatch(/Create notification/i);
      });
    });

    describe('#titleize', () => {
      it('should return word with first character in uppercase', () => {
        expect(titleize('hello')).toEqual('Hello');
      });
      it('should return word with first character in uppercase seperated by \'- or _\'', () => {
        expect(titleize('hello_world')).toEqual('Hello World');
        expect(titleize('hello-world')).toEqual('Hello World');
      });
    });

     describe('#pluralizeCount', () => {
      it('should add plural suffix \'s\' to word', () => {
        expect(pluralizeCount(2, 'apple')).toEqual('apples');
        expect(pluralizeCount(1, 'apple')).toEqual('apple');
      });
      it('should add custom plural suffix to word', () => {
        expect(pluralizeCount(2, 'brush', 'es')).toEqual('brushes');
      });
    });

    describe('#capitalize', () => {
      it('should return word with first character in uppercase', () => {
        expect(capitalize('hello world')).toEqual('Hello world');
      });
    });

    describe('#titleCase', () => {
      it('should return word with first character in uppercase', () => {
        expect(titleCase('hello world')).toEqual('Hello world');
      });
    });

    describe('#validateEmail', () => {
      it('should return false for invalid email', () => {
        expect(validateEmail('invalid email')).toBe(false);
        expect(validateEmail('s1@example')).toBe(false);
      });
       it('should return true for valid email', () => {
        expect(validateEmail('example@example.com')).toBe(true);
      });
    });

    describe('#forceLinkHttps', () => {
      it('should return \'https\' for \'http\'', () => {
        expect(forceLinkHttps('http://url')).toMatch(/https/i);
      });
    });

    describe('#truncateString', () => {
      it('should return truncated string with ellipses', () => {
        expect(truncateString('hello', 4)).toEqual('hell...');
        expect(truncateString('hello', 5)).toEqual('hello');
      });
    });

    describe('#removeNewLines', () => {
      it('should return string with new line replaced with whitespace', () => {
        expect(removeNewLines('hello \n world')).toEqual('hello  world');
        expect(removeNewLines('hello \r world')).toEqual('hello  world');
        expect(removeNewLines('hello \r\n world')).toEqual('hello  world');
      });
    });

    describe('#checkForHtmlTags', () => {
      it('should return true if string contains html tags', () => {
        expect(checkForHtmlTags('<h2>hello world</h2>')).toBe(true);
      });
      it('should return false if string does not contain html tags', () => {
        expect(checkForHtmlTags('hello world')).toBe(false);
      });
    });

    describe('#sanitizeText', () => {
      it('should sanitize text', () => {
        sanitizeText('http://www.url.com')

        expect(dompurify.sanitize).toHaveBeenCalled();
      });
    });

    describe('#getJustLabels', () => {
      it('should return a flattened array of strings without objects', () => {
        const result = getJustLabels([ {shortDesc: 'com_news_sms'}, 'com_news_email'])
        expect(result).toEqual([ 'com_news_sms', 'com_news_email' ]);
      });
    });

    describe('#invertArray', () => {
      it('should return new array with \'3\' in the second position', () => {
        const result = invertArray([1,2,3,4], 1, 2)
        expect(result).toEqual([ 1, 3, 2, 4 ]);
      });
      it('should throw error for initial index is not a number', () => {
        expect(() => {
          invertArray([1,2,3,4], '', 2)
        }).toThrowError();
      });
      it('should throw error for final index is not a number', () => {
        expect(() => {
          invertArray([1,2,3,4], 1, 'invalid')
        }).toThrowError();
      });
      it('should throw error for invalid array', () => {
        expect(() => {
          invertArray('invalid array', 1, 2)
        }).toThrowError();
      });
    });

    describe('#findLinkAndReplace', () => {
      it('should replace url in message with clickable links', () => {
        const result = findLinkAndReplace('Message with url - https://url.com')
        const anchorTagRegEx =  /<\/?[a-z][\s\S]*>/i
        
        expect(anchorTagRegEx.test(result)).toBe(true);
        expect(result).toMatch(/<a href/i);
        expect(result).toMatch(/https:\/\/url.com/i);
      });

      it('should replace email in message with clickable mailto', () => {
        const result = findLinkAndReplace('Message with email - email@email.com')
        const anchorTagRegEx =  /<\/?[a-z][\s\S]*>/i
        
        expect(anchorTagRegEx.test(result)).toBe(true);
        expect(result).toMatch(/<a href/i);
        expect(result).toMatch(/mailto:/i);
        expect(result).toMatch(/email@email.com/i);
      });
    });
});