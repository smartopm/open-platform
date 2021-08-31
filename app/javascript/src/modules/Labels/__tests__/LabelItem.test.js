import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import '@testing-library/jest-dom/extend-expect';
import LabelItem from '../Components/LabelItem';

describe('Label Item Component', () => {
  it('it should include the label details ', () => {
    const props = {
      label: {
        id: '2b3f902b-eb44',
        shortDesc: 'com_news_sms',
        userCount: 10
      },
      userType: 'admin'
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <LabelItem {...props} />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('com_news_sms')).toBeInTheDocument();
    expect(container.queryByText('10')).toBeInTheDocument();
    expect(container.queryByTestId('label-title')).toHaveTextContent('com_news_sms');

    fireEvent.click(container.queryByTestId('label_icon'))
    expect(container.queryByText('menu.delete')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('label-title'))
  });
});
