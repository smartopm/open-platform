import React from 'react';
import { BrowserRouter } from 'react-router-dom/';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { SideList } from '../components/SideList';


describe('Sidelist component', () => {
  const sideProps = {
    toggleDrawer: jest.fn(),
    user: {
      name: 'Jetro',
      phoneNumber: "0812311321321"
    },
    authState: {
      user: {
        userType: 'admin',
        id: 'Someer20384203',
      }
    }
  };

  it('should contain required list', () => {
    const { getByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <SideList {...sideProps} />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(getByText('Scanner')).toBeInTheDocument();
    expect(getByText('Search People')).toBeInTheDocument();
    expect(getByText('Contact')).toBeInTheDocument();
    expect(getByText('Logout')).toBeInTheDocument();
    expect(getByText('Preferences')).toBeInTheDocument();
    expect(getByText('Jetro')).toBeInTheDocument();
  });

  it('should not show search and scan when it is a client', () => {
    const moreProps = {
      toggleDrawer: jest.fn(),
      user: {
        name: 'Jetro',
         phoneNumber: "0812311321321"
      },
      authState: {
        user: {
          userType: 'client',
          id: 'Someer20384203',
          phoneNumber: "0812311321321"
        }
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <SideList {...moreProps} />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('Scanner')).not.toBeInTheDocument();
    expect(container.queryByText('Search People')).not.toBeInTheDocument();
    expect(container.queryByText('Logout')).toBeInTheDocument();
  });

  it('should not show search and scan when it is a resident', () => {
    const props = {
      toggleDrawer: jest.fn(),
      user: {
        name: 'Jetro',
         phoneNumber: "0812311321321"
      },
      authState: {
        user: {
          userType: 'resident',
          id: 'Someer20384203',
          phoneNumber: "0812311321321"
        }
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <SideList {...props} />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('Scanner')).not.toBeInTheDocument();
    expect(container.queryByText('Search People')).not.toBeInTheDocument();
    expect(container.queryByText('Logout')).toBeInTheDocument();
  });
});
