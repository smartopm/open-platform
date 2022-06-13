import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import FormContextProvider from '../../Context';
import TermsAndCondition from '../../components/TermsAndCondition';

jest.mock('react-markdown', () => 'div');
describe('TermsAndCondition', () => {
  it('should render with no errors', () => {
    const checkTerms = jest.fn();
    const categoriesData = [
      {
        renderedText: 'Some preview text here and there'
      }
    ];
    const wrapper = render(
      <MockedProvider>
        <FormContextProvider>
          <TermsAndCondition
            handleCheckTerms={checkTerms}
            categoriesData={categoriesData}
            isChecked
          />
        </FormContextProvider>
      </MockedProvider>
    );
    expect(wrapper.queryByText('actions.i_agree')).toBeInTheDocument();
    fireEvent.change(wrapper.queryByTestId('terms_agreement_check'), { target: { checked: true } });
    expect(wrapper.queryByTestId('terms_agreement_check').checked).toBe(true);
  });
});
