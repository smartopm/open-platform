import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserDetailHeader from '../Components/UserDetailHeader';

describe('User Detail Header Component', () => {
  const data = {
    user: {
      id: '37286ew3'
    }
  }
  it('should render the user detail header component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserDetailHeader data={data} userType='admin' currentTab='Contacts' />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('breadcrumb')).toBeInTheDocument();
    expect(container.queryByTestId('user-detail')).toBeInTheDocument();
  });
});
