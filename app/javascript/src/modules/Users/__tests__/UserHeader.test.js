import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
import UserHeader from '../Components/UserHeader';
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

  it('should render the user header component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserHeader
              setCampaignOption={jest.fn()}
              handleSearchClick={jest.fn()}
              filterObject={filterObject}
              csvObject={csvObject}
              menuObject={menuObject}
              actionObject={actionObject}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('title')).toBeInTheDocument();
    expect(container.queryByTestId('select')).toBeInTheDocument();
    expect(container.queryAllByTestId('button')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('arrow-icon')[0]).toBeInTheDocument();
    fireEvent.click(container.queryAllByTestId('arrow-icon')[0]);
    expect(container.queryAllByText('common:misc.all')[0]).toBeInTheDocument();
    fireEvent.click(container.queryAllByText('common:misc.all')[0]);
    expect(container.queryAllByTestId('button')[0]).toBeInTheDocument();
  });
});
