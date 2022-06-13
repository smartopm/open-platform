import React from 'react';
import { render, waitFor, fireEvent, within } from '@testing-library/react';

import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/react-testing';
import CreateLabel from '../Components/CreateLabel';
import { LabelCreate }from '../../../graphql/mutations';

describe('Create Label Component', () => {
  const data = {
    labels: [
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
  };

  const anotherLabelCreateMock = {
    request: {
      query: LabelCreate,
      variables: {
        shortDesc: 'COM234',
      }
    },
    result: {
      data: {
        labelCreate: {label: { id: 'hh27uyiu3hb43uy4iu3', shortDesc: 'COM234' }}
      }
    }
  };

  it('test creating a new label', async () => {
    const container = render(
      <MockedProvider mocks={[anotherLabelCreateMock]} addTypename={false}>
        <CreateLabel
          handleLabelSelect={jest.fn()}
          loading={false}
          setLoading={jest.fn()}
          setMessage={jest.fn()}
          data={data}
          refetch={jest.fn()}
        />
      </MockedProvider>
    );

    const autoComplete = container.queryByTestId("userLabel-creator");
    const input = within(autoComplete).getByRole("textbox");

    autoComplete.focus();
    expect(autoComplete).toBeVisible();
    userEvent.type(input, 'COM234');
    await waitFor(
      () => {
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(input.value).toEqual('COM234');
      },
      { timeout: 500 }
    );
  });
});
