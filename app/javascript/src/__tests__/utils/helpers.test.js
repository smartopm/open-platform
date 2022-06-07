import dompurify from 'dompurify';
import { paymentFilterFields } from '../../utils/constants'

import {
  sentencizeAction, titleize, pluralizeCount, capitalize, validateEmail, invertArray,
  findLinkAndReplace, forceLinkHttps, titleCase, truncateString, removeNewLines, checkForHtmlTags,
  sanitizeText, getJustLabels, checkValidGeoJSON, getHexColor, getDrawPluginOptions,
  handleQueryOnChange, checkAccessibilityForUserType, extractHostname, getObjectKey,
  decodeHtmlEntity
} from '../../utils/helpers'

jest.mock('dompurify')
describe('helper methods', () => {
    describe('#sentencizeAction', () => {
      it('should attach \'send\' to sendActions', () => {

        expect(sentencizeAction('Email')).toMatch(/Send Email/i);
        expect(sentencizeAction('Notification')).toMatch(/Send Notification/i);
      });
      it('should attach \'create\' to createActions', () => {
        expect(sentencizeAction('Task')).toMatch(/Create Task/i);
      });
      it('should not attach \'create\' to sendActions', () => {
        expect(sentencizeAction('Email')).not.toMatch(/Create Email/i);
        expect(sentencizeAction('Notification')).not.toMatch(/Create Notification/i);
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
        expect(validateEmail('(s1@example.com)')).toBe(false);
        expect(validateEmail('s1@example.da(2)213.co-2*i.23')).toBe(false);
        expect(validateEmail('-(s{}1@example.da2213.co.2i.23')).toBe(false);
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

    describe('#checkValidGeoJSON', () => {
      it('should return true for valid json', () => {
        expect(checkValidGeoJSON(JSON.stringify({ name: 'John' }))).toBe(true);
      });
      it('should return false for invalid json', () => {
        expect(checkValidGeoJSON('')).toBe(false);
        expect(checkValidGeoJSON(1234)).toBeFalsy();
        expect(checkValidGeoJSON(null)).toBeFalsy();
      });
    });

    describe('#getHexColor', () => {
      it('should return HEX color string', () => {
        expect(getHexColor(200)).toEqual('#F8F0E3');
      });
    });

    describe('#getDrawPluginOptions', () => {
      it('should return draw plugin config option', () => {
        expect(getDrawPluginOptions({})).toHaveProperty(
          'position',
          'draw',
          'edit',
        );
      });
    });

    describe('#checkAccessibilityForUserType', () => {
      const userTypes = ['admin', 'security_guard'];
      it('should return original accessibility when no ctx', () => {
        expect(checkAccessibilityForUserType({ userTypes, ctx: undefined })).toEqual(userTypes);
      });
      it('should allow accessibility when userType attempts to access its profile', () => {
        const ctx = {
          userId: 'bgd-123-gbw',
          userType: 'security_guard',
          loggedInUserId: 'bgd-123-gbw',
        };
        expect(checkAccessibilityForUserType({ userTypes, ctx })).toEqual(userTypes);
      });
      it('should allow accessibility when logged in userType is admin', () => {
        const ctx = {
          userId: 'bgd-123-gbw',
          userType: 'admin',
          loggedInUserId: 'edf-ugh-87r',
        };
        expect(checkAccessibilityForUserType({ userTypes, ctx })).toEqual(userTypes);
      });
      it('should deny accessibility for user type when not allowed to see menu item', () => {
        const ctx = {
          userId: 'bgd-123-gbw',
          userType: 'security_guard',
          loggedInUserId: 'edf-ugh-87r',
        };
        expect(checkAccessibilityForUserType({ userTypes, ctx })).toEqual(['admin']);
      });
    });
});

describe('handleQueryOnChange', () => {
  const selectedOptions = {
    data: {
      clientName: null
    },
    errors: [],
    logic: {
      and: [
        {
          '==': [
            {
              var: 'clientName'
            },
            'John Test'
          ]
        }
      ]
    }
  }
  it('should return query for the filter', () => {
    const result = handleQueryOnChange(selectedOptions, paymentFilterFields)

    expect(result).toEqual("user : 'John Test'");
  });
});

describe('#extractHostname', () => {
  it('extracts hostname from string URL', () => {
    expect(extractHostname('https://demo-staging.doublegdp.com/user/019234-c36a-41a7-beeb-12784').hostname).toEqual('demo-staging.doublegdp.com');
  });
  it('extracts userid from string URL', () => {
    expect(extractHostname('https://demo-staging.doublegdp.com/user/019234-c36a-41a7-beeb-12784').userId).toEqual('019234-c36a-41a7-beeb-12784');
  });

  it('does not explode if no arg is passed', () => {
    expect(extractHostname()).toBeUndefined()
  });
});

describe('#getObjectKey', () => {
  it("should the key for an object's value if the key is found", () => {
    const obj = { one: 'two', three: 'four' };
    const response = getObjectKey(obj, 'two');

    expect(response).toBeTruthy();
    expect(response).toEqual('one');

    expect(getObjectKey(obj, 'five')).toBe(undefined);
  });
});

describe('#decodeHtmlEntity', () => {
  it('decodes encoded HTML special characters and entity', () => {
    expect(decodeHtmlEntity('This Year &#8211; WINNERS')).toEqual('This Year – WINNERS');
    expect(decodeHtmlEntity('Copyright &#169; 2021 &#38; 2022')).toEqual('Copyright © 2021 & 2022');
  });
});