import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';

import LabelItem from '../Components/LabelItem';

describe('Label Item Component', () => {
  it('should include the label details', async () => {
    const props = {
      label: {
        id: '2b3f902b-eb44',
        shortDesc: 'com_news_sms',
        userCount: 10,
        color: '#000'
      },
      userType: 'admin',
      refetch: jest.fn()
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <LabelItem {...props} />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByText('com_news_sms')).toBeInTheDocument();
      expect(container.queryByText('10')).toBeInTheDocument();
      expect(container.queryByTestId('short_desc')).toHaveTextContent('com_news_sms');
  
      fireEvent.click(container.queryByTestId('label-menu'))
      expect(container.queryByText('menu.delete')).toBeInTheDocument();
      fireEvent.click(container.queryByTestId('short_desc'))
    })
  });
});
