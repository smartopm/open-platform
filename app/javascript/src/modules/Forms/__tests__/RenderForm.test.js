import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import RenderForm from '../components/RenderForm';
import FormContextProvider from '../Context';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.fn('@rails/activestorage/src/file_checksum', () => ({ create: jest.fn() }));
describe('Render Form Component', () => {
  it('should contain proper form properies', () => {
    const props = {
      formPropertiesData: {
        id: '234234',
        fieldName: 'Where are you ?',
        fieldType: 'text',
        adminUse: false
      },
      formId: '2342342',
      refetch: jest.fn(),
      editMode: true,
      categoryId: '232121',
      number: 1,
      formDetailRefetch: () => {}
    };

    const wrapper = render(
      <MockedProvider>
        <Context.Provider value={userMock}>
          <FormContextProvider>
            <MockedThemeProvider>
              <RenderForm {...props} />
            </MockedThemeProvider>
          </FormContextProvider>
        </Context.Provider>
      </MockedProvider>
    );
    expect(wrapper.queryByLabelText('text-input')).toBeInTheDocument();
    expect(wrapper.queryByLabelText('text-input')).toHaveTextContent('Where are you ?');
  });
});

it('should contain proper form properies with upload field and returns no errors for correct file type', () => {
  const props = {
    formPropertiesData: {
      id: '2342345',
      fieldName: 'Resume',
      fieldType: 'file_upload',
      adminUse: false
    },
    formId: '2342342',
    refetch: jest.fn(),
    editMode: true,
    categoryId: '232121',
    number: 1,
    formDetailRefetch: () => {}
  };

  const wrapper = render(
    <MockedProvider>
      <Context.Provider value={userMock}>
        <FormContextProvider>
          <MockedThemeProvider>
            <RenderForm {...props} />
          </MockedThemeProvider>
        </FormContextProvider>
      </Context.Provider>
    </MockedProvider>
  );
  const str = JSON.stringify('someRandomValues');
  const blob = new Blob([str]);
  const file = new File([blob], 'test_file.pdf', 'application/pdf');
  expect(wrapper.getByText('Resume')).toBeInTheDocument();
  expect(wrapper.getByText('form:misc.upload_file')).toBeInTheDocument();
  const inputElement = wrapper.queryByTestId('form-file-input');
  fireEvent.change(inputElement, { target: { files: [file] } });
  expect(wrapper.queryByText('form:errors.wrong_file_type')).not.toBeInTheDocument();
});

it('should contain proper form properies with upload field and returns errors for wrong file type', () => {
  const props = {
    formPropertiesData: {
      id: '2342345',
      fieldName: 'Resume',
      fieldType: 'file_upload',
      adminUse: false
    },
    formId: '2342342',
    refetch: jest.fn(),
    editMode: true,
    categoryId: '232121',
    number: 1,
    formDetailRefetch: () => {}
  };

  const wrapper = render(
    <MockedProvider>
      <Context.Provider value={userMock}>
        <FormContextProvider>
          <MockedThemeProvider>
            <RenderForm {...props} />
          </MockedThemeProvider>
        </FormContextProvider>
      </Context.Provider>
    </MockedProvider>
  );
  const str = JSON.stringify('someRandomValues');
  const blob = new Blob([str]);
  const file = new File([blob], 'test_file.json', 'application/JSON');
  expect(wrapper.getByText('Resume')).toBeInTheDocument();
  expect(wrapper.getByText('form:misc.upload_file')).toBeInTheDocument();
  const inputElement = wrapper.queryByTestId('form-file-input');
  fireEvent.change(inputElement, { target: { files: [file] } });
  expect(wrapper.getByText('form:errors.wrong_file_type')).toBeInTheDocument();
});
