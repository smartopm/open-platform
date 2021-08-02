import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { useTranslation } from 'react-i18next';
import ActionCard from '../components/ActionCard'
import '@testing-library/jest-dom/extend-expect'

const props = {
  openFlowModal: jest.fn(),
  actionFlow: {
    id: 'uuid00120',
    eventType: 'task_update',
    description: 'Some description',
    title: 'A workflow',
    active: true
  }
}

describe('ActionCard', () => {
  const { t } = useTranslation(['actionflow'])
  it('renders action-flow information', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionCard {...props} />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('A workflow')).toBeInTheDocument()
    expect(container.queryByText('Some description')).toBeInTheDocument()
    expect(
      container.queryByText(t('actionflow:misc.event_type', {eventType: props.actionFlow.eventType}))
    ).toBeInTheDocument()
    expect(container.queryByText(t('actionflow:misc.active'))).toBeInTheDocument()
  })
})
