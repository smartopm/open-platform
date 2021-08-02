import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { useTranslation } from 'react-i18next';
import ActionCardMenu from '../components/ActionCardMenu'
import '@testing-library/jest-dom/extend-expect'

const props = {
  open: true,
  handleClose: jest.fn(),
  openFlowModal: jest.fn(),
  data: {
    id: 'uuid000120',
    eventType: 'task_update',
    description: 'Some description',
    title: 'A workflow',
    active: true
  }
}
describe('ActionCardMenu', () => {
  const { t } = useTranslation(['common'])
  it('renders necessary menu options', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionCardMenu {...props} />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText(t('common:menu.edit'))).toBeInTheDocument()
    expect(container.queryByText(t('common:menu.delete'))).toBeInTheDocument()
  })
})
