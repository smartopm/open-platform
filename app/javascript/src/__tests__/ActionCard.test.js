import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import ActionCard from '../components/ActionCard';

import MockedThemeProvider from '../modules/__mocks__/mock_theme';

const props = {
  openFlowModal: jest.fn(),
  refetch: jest.fn(),
  actionFlow: {
    id: 'uuid00120',
    eventType: 'task_update',
    description: 'Some description',
    title: 'A workflow',
    active: true,
    createdAt: '2021-01-01'
  }
};

describe('ActionCard', () => {
  it('renders action-flow information', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <ActionCard {...props} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByText('A workflow')).toBeInTheDocument();
    expect(container.queryByText('Some description')).toBeInTheDocument();
    expect(
      container.queryByText('actionflow:misc.event_type', { eventType: props.actionFlow.eventType })
    ).toBeInTheDocument();
    expect(container.queryByText('actionflow:misc.active')).toBeInTheDocument();
  });
});
