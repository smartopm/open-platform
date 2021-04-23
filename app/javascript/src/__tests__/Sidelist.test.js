import React from 'react';
import { BrowserRouter } from 'react-router-dom/';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { SideList } from '../components/SideList';
import '@testing-library/jest-dom/extend-expect';

describe('Sidelist component', () => {
  const sideProps = {
    toggleDrawer: jest.fn(),
    user: {
      name: 'Jetro'
    },
    authState: {
      user: {
        userType: 'admin'
      }
    }
  };

  it('should contain required list ', () => {
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

  it('should not show search and scan when it is not admin', () => {
    const moreProps = {
      toggleDrawer: jest.fn(),
      user: {
        name: 'Jetro'
      },
      authState: {
        user: {
          userType: 'client'
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

  it('should not show search and scan when it is not admin', () => {
    const props = {
      toggleDrawer: jest.fn(),
      user: {
        name: 'Jetro'
      },
      authState: {
        user: {
          userType: 'resident'
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
