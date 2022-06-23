import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
import UserSelectButton, { UserProcessCSV, UserMenuitems, UserActionSelectMenu, UserSearch } from '../Components/UserHeader';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('User Detail Component', () => {
  const InitialConfig = MuiConfig;
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      role: {
        label: 'Role',
        type: 'select',
        fieldSettings: {
          listValues: [{ value: '', title: '' }]
        }
      }
    }
  };

  const queryBuilderInitialValue = {
    id: '99a8a9ba-0123-3344-c56d-b16e532c8cd0',
    type: 'group',
    children1: {
      '11b8a9ba-0123-4456-b89a-b16e721c8cd0': {
        type: 'rule',
        properties: {
          field: 'role',
          operator: 'select_equals',
          value: [''],
          valueSrc: ['value'],
          valueType: ['select']
        }
      }
    }
  };

  const filterObject = {
    labelError: null,
    displayBuilder: jest.fn,
    handleQueryOnChange: jest.fn(),
    queryBuilderConfig,
    queryBuilderInitialValue,
    toggleFilterMenu: jest.fn()
  };

  const csvObject = {
    handleDownloadCSV: jest.fn(),
    usersLoading: false,
    csvUserData: {}
  };

  const menuObject = {
    handleMenu: jest.fn(),
    menuAnchorEl: document.createElement("button"),
    setAnchorEl: jest.fn(),
    menuData: [
      {
        content: 'sample 1',
        isVisible: true,
        handleClick: jest.fn()
      }
    ]
  };

  const actionObject = {
    campaignCreateOption: 'none',
    handleCampaignCreate: jest.fn(),
    handleLabelSelect: jest.fn(),
    usersCountData: { usersCount: 2 },
    selectedUsers: [],
    labelsData: {},
    labelsRefetch: jest.fn(),
    viewFilteredUserCount: jest.fn(),
    userList: []
  };

  it('should render the userSelectComponent', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserSelectButton
              setCampaignOption={jest.fn()}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('button')).toBeInTheDocument();
  });

  it('should render the userProcessCSV component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserProcessCSV
              csvObject={csvObject}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('download_csv_btn')).toBeInTheDocument();
  });

  it('should render the userMenuItem component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserMenuitems
              menuObject={menuObject}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('menu-list')).toBeInTheDocument();
  });

  it('should render the userActionSelect component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserActionSelectMenu
              actionObject={actionObject}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('user_action')).toBeInTheDocument();
  });

  it('should render the userSearch component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserSearch
              handleSearchClick={jest.fn()}
              filterObject={filterObject}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('search')).toBeInTheDocument();
  });
});
