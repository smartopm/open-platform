import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import FormContextProvider from '../../Context';
import TextPreview from '../../components/TextPreview';

jest.mock('react-markdown', () => 'div');
describe('TextPreview', () => {
  it('should render the text preview with no errors', () => {
    const categoriesData = [
      {
        renderedText: 'Some preview text here and there'
      }
    ];
    const wrapper = render(
      <MockedProvider>
        <FormContextProvider>
          <TextPreview categoriesData={categoriesData}>
            <span>Some preview text </span>
          </TextPreview>
        </FormContextProvider>
      </MockedProvider>
    );
    expect(wrapper.queryByText('Some preview text')).toBeInTheDocument();
    expect(wrapper.queryByText('Some preview text here and there')).toBeInTheDocument();
  });
});
