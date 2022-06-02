/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import MailTemplateItem, { renderEmailTemplate } from '../components/MailTemplateItem'
import t from '../../__mocks__/t'

describe('It should test component', () => {
  const data = {
    id: '501b718c-8687-4e78-60b732df534ab1',
    name: 'welcome_email',
    subject: "Welcome to App",
    tag: '',
    data: {},
    variableNames: {},
    createdAt: new Date()
  }

  const menuData = {
    menuList: [
      { content: 'Edit', isAdmin: true, handleClick: jest.fn() },
      { content: 'Duplicate', isAdmin: true, handleClick: jest.fn() },  
    ],
    handleTemplateMenu: jest.fn(),
    anchorEl: null,
    open: true,
    handleClose: jest.fn()
  }

  it('should check if MailTemplateItem renders with no error', () => {
    const mailListHeader = [
      { title: 'Name', value: t('common:table_headers.name'), col: 2 },
      { title: 'Subject', value: t('common:table_headers.subject'), col: 5 },
      { title: 'Date Created', value: t('common:table_headers.date_created'), col: 1 },
      { title: 'Tag', value: t('common:table_headers.tag'), col: 1 },
      { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
    ];
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <MailTemplateItem email={data} onTemplateClick={() => {}} onTemplateDuplicate={() => {}} headers={mailListHeader} />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("name")).toBeInTheDocument()
    expect(container.getByTestId("subject")).toBeInTheDocument()
    expect(container.getByTestId("createdat")).toBeInTheDocument()
    expect(container.getByTestId("tag")).toBeInTheDocument()
    expect(container.getByTestId("menu")).toBeInTheDocument()
  });

  it('should check if renderEmailTemplate works as expected', () => {
    const results = renderEmailTemplate(data, menuData);
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Date Created');
    expect(results[0]).toHaveProperty('Subject');
    expect(results[0]).toHaveProperty('Name');
    expect(results[0]).toHaveProperty('Menu')

    const nameWrapper = render(results[0].Name)
    const subjectWrapper = render(results[0].Subject)
    expect(nameWrapper.queryByText('welcome_email')).toBeInTheDocument()
    expect(subjectWrapper.queryByText('Welcome to App')).toBeInTheDocument()
  });
});