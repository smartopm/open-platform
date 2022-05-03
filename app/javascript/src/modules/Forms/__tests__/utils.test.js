import {
  addPropWithValue,
  checkCondition,
  extractValidFormPropertyFieldNames,
  extractValidFormPropertyValue,
  flattenFormProperties,
  nonNullValues,
  parseRenderedText,
  propExists,
  requiredFieldIsEmpty,
  extractRenderedTextFromCategory,
  checkRequiredFormPropertyIsFilled,
  generateIframeSnippet,
  convertUploadSize,
  cleanFileName,
  fileTypes,
  isUploaded,
  isFileNameSelect
} from '../utils';

describe('Utilities', () => {
  it('modifies the prop value array', () => {
    // propExists
    const values = [
      { value: '24223', form_property_id: '34fw4342' },
      { value: '45', form_property_id: '3fw4342' }
    ];
    expect(propExists(values, '34fw4342')).toBe(true);
    expect(propExists(values, '34f')).toBe(false);
    // add null values to array
    addPropWithValue(values, '34f');
    expect(values).toHaveLength(3);

    // add nothing to the array
    addPropWithValue(values, '34f');
    expect(values).toHaveLength(3);

    // this should pass this time
    expect(propExists(values, '34f')).toBe(true);
  });

  it('should format form properties', () => {
    const props = [
      {
        formId: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
        formProperties: []
      },
      {
        formId: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
        formProperties: [
          {
            id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
            fieldName: 'What is your location ?',
            fieldType: 'text'
          }
        ]
      },
      {
        formId: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
        formProperties: [
          {
            id: '527a112d-2342-4bff-b8f1-b5f9e92dce18',
            fieldName: 'Profile Pic',
            fieldType: 'file_upload'
          },
          {
            id: '4141b753-0474-4c5f-a6d6-923174fff5c2',
            fieldName: 'Sign here',
            fieldType: 'signature'
          }
        ]
      }
    ];

    expect(flattenFormProperties(props)).toMatchObject([
      {
        id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
        fieldName: 'What is your location ?',
        fieldType: 'text'
      },
      {
        id: '527a112d-2342-4bff-b8f1-b5f9e92dce18',
        fieldName: 'Profile Pic',
        fieldType: 'file_upload'
      },
      {
        id: '4141b753-0474-4c5f-a6d6-923174fff5c2',
        fieldName: 'Sign here',
        fieldType: 'signature'
      }
    ]);
  });

  it('extracts values from a property field that a user is typing in', () => {
    const formProperties = {
      'How are you?': {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: ' 26'
      },
      Name: {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: ' their name'
      },
      'Something else': {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: ' And yes it is true'
      },
      "Choices": {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        type: 'checkbox',
        value: {
          first: true,
          second: false,
          third: true
        }
      }
    };
    expect(extractValidFormPropertyValue(formProperties)).toMatchObject([
      {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: ' 26'
      },
      {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: ' their name'
      },
      {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: ' And yes it is true'
      },
      {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: 'first, second, third'
      },

    ]);
    expect(extractValidFormPropertyValue({})).toHaveLength(0)

    expect(extractValidFormPropertyFieldNames(formProperties)).toMatchObject([
      {
        value: ' 26',
        fieldName: 'How are you?'
      },
      {
        fieldName: 'Name',
        value: ' their name'
      },
      {
        fieldName: 'Something else',
        value: ' And yes it is true'
      },
      {
        fieldName: 'Choices',
        value: 'first, third'
      },
    ]);
    expect(extractValidFormPropertyFieldNames({})).toHaveLength(0)
  });

  it('only shows a category if it matches the given display condition', () => {
    const category = {
      fieldName: 'Main Category',
      headerVisible: true,
      id: '34234234',
      displayCondition: {
        condition: '',
        value: '',
        groupingId: ''
      },
      renderedText: 'Some category'
    }

    // matches the propertyId but wrong condition
    const categoryWithPropertyId = {
      fieldName: 'Main Category',
      headerVisible: true,
      id: '34234234',
      displayCondition: {
        condition: '===',
        value: '10',
        groupingId: '9e50f4db-3d75-431d-a772-261971a6ed92'
      },
      renderedText: 'categoryWithPropertyId'
    }

    const categoryWithWrongCondition = {
      fieldName: 'Main Category',
      headerVisible: true,
      id: '34234234',
      displayCondition: {
        condition: '<',
        value: '10',
        groupingId: '9e50f4db'
      }
    }
    const categoryWithMatchingCondition = {
      fieldName: 'Main Category',
      headerVisible: true,
      id: '34234234',
      displayCondition: {
        condition: '>',
        value: '10',
        groupingId: '9e50f4db-3d75-431d-a772-261971a6ed92'
      },
      renderedText: 'and this also matches'
    }
    const properties = [
      {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: '15'
      },
      {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: ' And yes it is true'
      }
    ]

    expect(checkCondition(category, properties, true)).toBe(true) // editmode always shows
    expect(checkCondition(category, properties, false)).toBe(true) // not in editmode but no condition provided
    expect(checkCondition(categoryWithWrongCondition, properties, false)).toBe(false) // condition has no matching property
    expect(checkCondition(categoryWithPropertyId, properties, false)).toBe(false) // condition matches property but wrong condition
    expect(checkCondition(categoryWithMatchingCondition, properties, false)).toBe(true) // condition matches all

    // extract rendered text 
    expect(extractRenderedTextFromCategory(properties, [category, categoryWithPropertyId, categoryWithWrongCondition])).toEqual('Some category  ')
    expect(extractRenderedTextFromCategory(properties, [category, categoryWithMatchingCondition])).toEqual('Some category  and this also matches  ')
    expect(extractRenderedTextFromCategory(properties, [])).toEqual('')
    expect(extractRenderedTextFromCategory(properties, [])).toEqual('')
    expect(extractRenderedTextFromCategory(properties, null)).toEqual('')
  })

  it('should parse and then find and replace variables in a string', () => {
    const text = `This is a nice string with #variables that has #name with #NAME, OR #variables. end of line \n#support \n\n#support`
    const sampleText = `And some other text riught here  with cook underscores #some_Dynamic_Values and another one here #some_dynamic_values or this \n\n#SOME_DYNAMIC_VALUES ## Another nice tile \n#some_Dynamic_Values`
    
    const categories = [{
        fieldName: 'Main Category',
        headerVisible: true,
        id: '34234234',
        displayCondition: {
          condition: '',
          value: '',
          groupingId: ''
        },
        renderedText: text
      },
      {
        fieldName: 'Main Category',
        headerVisible: true,
        id: '878',
        displayCondition: {
          condition: '',
          value: '',
          groupingId: ''
        },
        renderedText: sampleText
      }
    ]

    const data = {
      name: {
        value: ' Joe',
      },
      'variables': {
        value: 'And yes it is true',
      },
      'support': {
        value: 'yes',
      },
      'some dynamic values': {
        value: 'test one three',
      },
    }

    expect(parseRenderedText([categories[0]], data)).toContain('This is a nice string with And yes it is true that has  Joe with  Joe, OR And yes it is true. end of line \nyes \n\nyes')
    expect(parseRenderedText(categories, data)).toContain(`And some other text riught here  with cook underscores test one three and another one here test one three or this \n\ntest one three ## Another nice tile \ntest one three`)
    expect(parseRenderedText([], data)).toBe('')
    expect(parseRenderedText(null, data)).toBe('')
  })

  it('checks for null values', () => {
    const item = {
      value: 'sds',
      form_property_id: null
    }
    expect(nonNullValues(item)).toBe(false)
    expect(nonNullValues({ value: 'some', form_property_id: 'wweqw' })).toBe(true)
    expect(nonNullValues({ value: {checked: 'somed'}, form_property_id: '290384321' })).toBe(true)
    expect(nonNullValues({ value: {checked: null}, form_property_id: null })).toBe(false)
  })

  it('checks for empty required fields', () => {
    const formData  = [
      {
        id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
        fieldName: 'What is your location ?',
        fieldType: 'text',
        required: false
      },
      {
        id: '527a112d-2342-4bff-b8f1-b5f9e92dce18',
        fieldName: 'What is your name ?',
        fieldType: 'text',
        required: true
      }
    ]

    const categories = [
      {
        formId: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
        displayCondition: null,
        formProperties: formData 
      },
    ]

    const filledInProperties = [
      { value: 'Lagos', form_property_id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' },
      { value: null, form_property_id: '527a112d-2342-4bff-b8f1-b5f9e92dce18' }
    ];

    expect(requiredFieldIsEmpty(filledInProperties, categories)).toBe(true)

    const categories2 = [
      {
        formId: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
        displayCondition: null,
        formProperties: [
          {
            id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
            fieldName: 'What is your location ?',
            fieldType: 'text',
            required: false
          },
        ] 
      },
    ]

    expect(requiredFieldIsEmpty(filledInProperties, categories2)).toBe(false)
  })

  it('returns true if on validation error a required form property is not filled', () => {
    expect(checkRequiredFormPropertyIsFilled(
      {
        id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
            fieldName: 'What is your location ?',
            fieldType: 'text',
            required: true
      },
      {
        error: true,
        filledInProperties: [
          { value: null, form_property_id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' },
        ],
        categories: [
          {
            displayCondition: {condition: '', groupingId: '', value: ''},
            formProperties: [{ id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' }]
          }
        ],
      }
    )).toBe(true)
  });

  it('returns false if on validation error a required form property is filled', () => {
    expect(checkRequiredFormPropertyIsFilled(
      {
        id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
            fieldName: 'What is your location ?',
            fieldType: 'text',
            required: true
      },
      {
        error: true,
        filledInProperties: [
          { value: 'Lagos', form_property_id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' },
        ],
        categories: [
          {
            displayCondition: {condition: '', groupingId: '', value: ''},
            formProperties: [{ id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' }]
          }
        ],
      }
    )).toBe(false)
  });

  it('returns true if on validation error a required form property is filled', () => {
    expect(checkRequiredFormPropertyIsFilled(
      {
        id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
            fieldName: 'Qualifications',
            fieldType: 'checkbox',
            required: true
      },
      {
        error: true,
        filledInProperties: [
          { value: { Bachelor: true, Masters: false }, form_property_id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' },
        ],
        categories: [
          {
            displayCondition: {condition: '', groupingId: '', value: ''},
            formProperties: [{ id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' }]
          }
        ],
      }
    )).toBe(true)
  });

  it('considers active categories, returns false on validation error if a required form property is filled', () => {
    expect(checkRequiredFormPropertyIsFilled(
      {
        id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
        fieldName: 'What is your location ?',
        fieldType: 'text',
        required: true
      },
      {
        error: true,
        filledInProperties: [
          { value: 'Lagos', form_property_id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' },
        ],
        categories: [
          {
            displayCondition: {condition: '===', groupingId: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda', value: 'Lagos'},
            formProperties: [{ id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' }]
          }
        ],
      }
    )).toBe(false)
  });

  it('considers no active categories, returns false without performing validations', () => {
    expect(checkRequiredFormPropertyIsFilled(
      {
        id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
        fieldName: 'What is your location ?',
        fieldType: 'text',
        required: true
      },
      {
        error: false,
        filledInProperties: [
          { value: null, form_property_id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' },
        ],
        categories: [
          {
            displayCondition: {condition: '===', groupingId: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda', value: 'Lusaka'},
            formProperties: [{ id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda' }]
          }
        ],
      }
    )).toBe(false)
  });

  it('returns defaults to false if undefined', () => {
    expect(checkRequiredFormPropertyIsFilled(
     undefined,
     undefined
    )).toBe(false)
  });
  it('should generate an iframe snippet', () => {
    const data = { id: '23223', name: 'Some form' }
    const snippet = generateIframeSnippet(data, 'dev.dgdp.site')
    expect(snippet).toBe('<iframe src=https://dev.dgdp.site/form/23223/public name=Some form title=Some form scrolling="auto" width="100%" height="500px" />')
  })

  // convertUploadSize
  it('should convert different sizes to readable format', () => {
    const size1 = 2000
    const size2 = 20000
    const size3 = 2000000
    const size4 = 20000000000

    expect(convertUploadSize(0)).toBe('N/A')
    expect(convertUploadSize(2)).toBe('2 Bytes')
    expect(convertUploadSize(size1)).toBe('2 KB')
    expect(convertUploadSize(size2)).toBe('20 KB')
    expect(convertUploadSize(size3)).toBe('2 MB')
    expect(convertUploadSize(size4)).toBe('19 GB')
  });

  it('should clean file names before uploading files', () => {
    expect(cleanFileName()).toBe('')
    expect(cleanFileName('someimage.jpg')).toBe('Someimage')
    expect(cleanFileName('someimageanotherimageimage.jpg')).toBe('Someimageanotherim...')
  });

  it('should return translatable files', () => {
    const translate = jest.fn(() => 'Translated type')
    expect(fileTypes(translate)['application/pdf']).toBe('Translated type')
  });

  it('should check if file is uploaded per specific form property', () => {
    const uploads = [
      {
        filename: "Image.jpg",
        propertyId: "02394203da0923"
      },
      {
        filename: "another.png",
        propertyId: "12345678790"
      },
    ]
    const file = { name: "another.png" }
    expect(isUploaded(uploads, file, '12345678790')).toBe(true)
    expect(isUploaded(uploads, file, '02394203da0923')).toBe(false)
    expect(isUploaded(uploads, file, '9238423421312')).toBe(false)
    expect(isUploaded([], undefined, '9238423421312')).toBe(false)
    expect(isUploaded()).toBe(false)
  });

  it('should check if file is included in filesnames', () => {
    const filenames = [
      {
        name: "Image.jpg",
        propertyId: "02394203da0923"
      },
      {
        name: "another.png",
        propertyId: "12345678790"
      },
    ]
    const name  = 'another.png'
    expect(isFileNameSelect(filenames, name, '12345678790')).toBe(true)
    expect(isFileNameSelect(filenames, name, '02394203da0923')).toBe(false)
    expect(isFileNameSelect(filenames, name, '9238423421312')).toBe(false)
    expect(isFileNameSelect([], undefined, '9238423421312')).toBe(false)
    expect(isFileNameSelect()).toBe(false)
  });

});