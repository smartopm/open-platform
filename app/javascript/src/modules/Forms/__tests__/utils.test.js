import { addPropWithValue, flattenFormProperties, propExists } from "../utils"

describe('Utilities', () => {
    it('modifies the prop value array', () => {
        // propExists
        const values = [{value: '24223', form_property_id: '34fw4342'}, {value: '45', form_property_id: '3fw4342'}]
        expect(propExists(values, '34fw4342')).toBe(true)
        expect(propExists(values, '34f')).toBe(false)
        // add null values to array
        addPropWithValue(values, '34f')
        expect(values).toHaveLength(3)
        // this should pass this time
        expect(propExists(values, '34f')).toBe(true)
      })

      it('should format form properties', () => {
        const props = [
            {
              formId: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
              formProperties: [],
            },
            {
              formId: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
              formProperties: [
                {
                  id: '5d8a6fd7-3ebc-4d34-9562-00a2518cddda',
                  fieldName: 'What is your location ?',
                  fieldType: 'text',
                },
              ],
            },
            {
              formId: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
              formProperties: [
                {
                  id: '527a112d-2342-4bff-b8f1-b5f9e92dce18',
                  fieldName: 'Profile Pic',
                  fieldType: 'file_upload',
                },
                {
                  id: '4141b753-0474-4c5f-a6d6-923174fff5c2',
                  fieldName: 'Sign here',
                  fieldType: 'signature',
                },
              ],
            },
          ];

        expect(flattenFormProperties(props)).toMatchObject(
            [
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
              ]
        )
      })
})

 