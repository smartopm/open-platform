import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { MockedProvider } from '@apollo/react-testing';
import FormPreview from '../../components/FormPreview';
import FormContextProvider from '../../Context';

// while running tests, it automatically wraps this in <> so it is better to mock with a valid tagname to avoid jest warnings
jest.mock('react-markdown', () => 'div');
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Form Preview component', () => {
  it('should not break form preview', () => {
    const props = {
      categoriesData: [
        {
          renderedText: 'Some preview text here and there'
        }
      ],

      loading: false,
      handleFormSubmit: jest.fn()
    };
    const rendered = render(
      <MockedProvider>
        <FormContextProvider>
          <FormPreview {...props} />
        </FormContextProvider>
      </MockedProvider>
    );
    expect(rendered.queryByText('actions.confirm')).toBeInTheDocument();
    expect(rendered.queryByText('Some preview text here and there')).toBeInTheDocument();
    fireEvent.click(rendered.queryByTestId('confirm_contract'));
    expect(props.handleFormSubmit).toBeCalled();
  });
});
