import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import FormBuilderPage from '../../containers/Forms/FormBuilderPage';



jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('FormBuilderPage Component', () => {
  it('renders FormBuilder text', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <FormBuilderPage />
        </BrowserRouter>
      </MockedProvider>
    );

  });
});
