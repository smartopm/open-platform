import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CheckboxInput from '../../components/Forms/CheckboxInput'


describe('Checkbox component', () => {
    it('should not break the text input', () => {
      const props = {
          handleValue: jest.fn(),
          properties: { 
              fieldName: 'are you ?', 
              required: false,
              fieldValue: [{value: false, label: 'are you ?'}]
            },
      }
      const wrapper = render(<CheckboxInput {...props} />)
      expect( wrapper.queryAllByText('are you ?')).toHaveLength(2)
      expect( wrapper.queryAllByText('are you ?')[0]).toBeInTheDocument()
    })
  })