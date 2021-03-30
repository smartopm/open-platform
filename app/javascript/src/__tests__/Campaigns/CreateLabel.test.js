import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import CreateLabel from '../../components/CreateLabel';
import { LabelsQuery } from '../../graphql/queries';

describe('Create Label Component', () => {
  const labels = [
    {
      id: 'hh27uyiu3hb43uy4iu3',
      shortDesc: 'COM',
      userCount: 2,
      description: 'desc',
      color: 'blue'
    },
    {
      id: 'hh27uyiu3hb43uy4',
      shortDesc: 'COM2',
      userCount: 3,
      description: 'desc2',
      color: 'black'
    }
  ]
  const mock = {
    request: {
      query: LabelsQuery
    },
    result: {
      data: {
        labels
      }
    }
  };
  it('renders correctly', async () => {
    const container = render(
      <MockedProvider mocks={[mock]}>
        <CreateLabel handleLabelSelect={jest.fn} />
      </MockedProvider>
    );

    await waitFor(
      () => {
        expect(container.getByTestId("userLabel-creator")).toBeInTheDocument()
      },
      { timeout: 500 }
    );
  });
});
