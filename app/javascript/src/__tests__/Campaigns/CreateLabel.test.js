import React from 'react';
import { render, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/react-testing';
import CreateLabel from '../../components/CreateLabel';
import { LabelCreate }from '../../graphql/mutations';

describe('Create Label Component', () => {
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
          handleLabelSelect={jest.fn}
          loading={false}
          setLoading={jest.fn}
          setMessage={jest.fn}
        />
      </MockedProvider>
    );

    const autoComplete = container.queryByTestId("userLabel-creator")
    const input = within(autoComplete).getByRole("textbox");

    autoComplete.focus()
    userEvent.type(input, 'COM234')

    await waitFor(
      () => {
        fireEvent.keyDown(autoComplete, { key: 'Enter' })
        expect(input.value).toEqual('COM234') 
      },
      { timeout: 500 }
    );
  });
});
