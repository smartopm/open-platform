import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing';
import RenderForm from '../components/RenderForm';
import FormContextProvider from '../Context'
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Render Form Component', () => {
  it('should contain proper form properies', () => {
    const props = {
        formPropertiesData: {
            id: "234234",
            fieldName: "Where are you ?",
            fieldType: "text",
            adminUse: false
        },
        formId: "2342342",
        refetch: jest.fn(),
        editMode: true,
        categoryId:"232121"
    }

 
    const wrapper = render(
      <MockedProvider>
        <Context.Provider value={userMock}>
          <FormContextProvider>
            <RenderForm {...props} />
          </FormContextProvider>
        </Context.Provider>
      </MockedProvider>
    )
    // expect(wrapper.queryByText('Some child component that should inherit the current state')).toBeInTheDocument()
    expect(wrapper.queryByLabelText('text-input')).toBeInTheDocument()
    expect(wrapper.queryByLabelText('text-input')).toHaveTextContent('Where are you ?')
  })
})
