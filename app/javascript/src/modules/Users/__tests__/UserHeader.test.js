import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserHeader from '../Components/UserHeader';

describe('User Detail Component', () => {
  const filterObject = {
    labelError: null,
    displayBuilder: jest.fn,
    handleQueryOnChange: jest.fn(),
    queryBuilderConfig: { operators: { select_equals: '==' } },
    queryBuilderInitialValue: {},
    toggleFilterMenu: jest.fn()
  }

  const csvObject = {
    handleDownloadCSV: jest.fn(),
    usersLoading: false,
    csvUserData: {}
  }

  const menuObject = {
    handleMenu: jest.fn(),
    menuAnchorEl: null,
    setAnchorEl: jest.fn(),
    menuData: [{
      content: 'sample 1',
      isVisible: true,
      handleClick: jest.fn()
    }]
  };

  const actionObject = {
    campaignCreateOption: 'none',
    handleCampaignCreate: jest.fn(),
    handleLabelSelect: jest.fn(),
    usersCountData: {},
    selectedUsers: [],
    labelsData: {},
    labelsRefetch: jest.fn(),
    viewFilteredUserCount: jest.fn(),
    userList: []
  }

  it('should render the user header component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserHeader
            setCampaignOption={jest.fn()}
            handleSearchClick={jest.fn()}
            filterObject={filterObject}
            csvObject={csvObject}
            menuObject={menuObject}
            actionObject={actionObject}
          />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('title')).toBeInTheDocument();
    expect(container.queryByTestId('select')).toBeInTheDocument();
  });
});
