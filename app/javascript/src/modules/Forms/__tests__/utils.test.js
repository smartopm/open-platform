import {
  addPropWithValue,
  checkCondition,
  extractValidFormPropertyFieldNames,
  extractValidFormPropertyValue,
  flattenFormProperties,
  nonNullValues,
  parseRenderedText,
  propExists
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
      }
    ]);

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
      }
    ]);
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
      }
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
      }
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
      }
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
  })

  it('should parse and then find and replace variables in a string', () => {
    const text = `This is a nice string with #variables that has #name with end of line \n#support \n\n#support`
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
    }
    expect(parseRenderedText(text, data)).toContain('This is a nice string with And yes it is true that has  Joe with end of line \nyes \n\nyes')
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
});
