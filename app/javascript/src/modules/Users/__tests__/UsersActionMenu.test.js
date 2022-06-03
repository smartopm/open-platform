import React from 'react'
import { render } from '@testing-library/react'
import UsersActionMenu from '../Components/UsersActionMenu'

import MockedThemeProvider from '../../__mocks__/mock_theme'

const props = {
  campaignCreateOption: 'none',
  setCampaignCreateOption: jest.fn(),
  handleCampaignCreate: jest.fn(),
  handleLabelSelect: jest.fn(),
  setSelectAllOption: jest.fn(),
  labelsRefetch: jest.fn(),
  copyToClipBoard: jest.fn(),
  selectedUsers: [],
  selectCheckBox: true,
  usersCountData: {
    usersCount: 25
  },
  labelsData: {
    labels: []
  }
}
describe('UsersActionMenu component', () => {
  it('should render hide "Create Campaign" link', () => {
    const container = render(
      <MockedThemeProvider>
        <UsersActionMenu {...props} />
      </MockedThemeProvider>
    )

    expect(container.queryByText('common:form_actions.assign_label')).toBeNull();
    expect(container.queryByText('common:form_actions.create_campaign')).toBeNull();
    expect(container.queryByText('common:form_actions.copy_id')).toBeNull();
  })

  it('should render both bulk action links', () => {
    const newProps = {
      ...props,
      campaignCreateOption: 'all_on_this_page',
      selectedUsers: ['hgjhwewhjebwuwd']
    }
    const container = render(
      <MockedThemeProvider>
        <UsersActionMenu {...newProps} />
      </MockedThemeProvider>
    )

    expect(container.queryByText('common:form_actions.create_campaign')).toBeInTheDocument();
    expect(container.queryByText('common:form_actions.assign_label')).toBeInTheDocument();
    expect(container.queryByText('common:form_actions.copy_id')).toBeInTheDocument();
  })

  it('should render bulk action links if some users have been selected', () => {
    const newProps = {
      ...props,
      selectedUsers: ['uuuid-63728']
    }
    const container = render(
      <MockedThemeProvider>
        <UsersActionMenu {...newProps} />
      </MockedThemeProvider>
    )

    expect(container.queryByText('common:form_actions.create_campaign')).toBeInTheDocument();
    expect(container.queryByText('common:form_actions.assign_label')).toBeInTheDocument();
    expect(container.queryByText('common:form_actions.copy_id')).toBeInTheDocument();
  })
})
