import React from 'react'
import { render } from '@testing-library/react'
import UsersActionMenu from '../Components/UsersActionMenu'
import '@testing-library/jest-dom/extend-expect'

const props = {
  campaignCreateOption: 'none',
  setCampaignCreateOption: jest.fn(),
  handleCampaignCreate: jest.fn(),
  handleLabelSelect: jest.fn(),
  setSelectAllOption: jest.fn(),
  selectedUsers: [],
  selectCheckBox: true,
  userList: [],
  usersCountData: {
    usersCount: 25
  }
}
describe('UsersActionMenu component', () => {
  it('should render "Select" and hide "Create Campaign" link', () => {
    const container = render(<UsersActionMenu {...props} />)

    expect(container.queryByText('common:misc.select')).toBeInTheDocument()
    expect(container.queryByText('common:form_actions.create_campaign')).toBeNull()
  })

  it('should render both "Select" and bulk action links', () => {
    const newProps = {
      ...props,
      campaignCreateOption: 'all'
    }
    const container = render(<UsersActionMenu {...newProps} />)

    expect(container.queryByText('common:misc.select')).toBeInTheDocument()
    expect(container.queryByText('common:form_actions.create_campaign')).toBeInTheDocument()
    expect(container.queryByText('common:form_actions.assign_label')).toBeInTheDocument()
  })

  it('should render bulk action links if some users have been selected', () => {
    const newProps = {
      ...props,
      selectedUsers: ['uuuid-63728']
    }
    const container = render(<UsersActionMenu {...newProps} />)

    expect(container.queryByText('common:form_actions.create_campaign')).toBeInTheDocument()
    expect(container.queryByText('common:form_actions.assign_label')).toBeInTheDocument()
  })
})
