import React from 'react';
import { render, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/react-testing';
import CreateLabel from '../../components/CreateLabel';
import { LabelsQuery } from '../../graphql/queries';
import { LabelCreate }from '../../graphql/mutations';

describe('Create Label Component', () => {
  const labels = [
    {
      id: 'hh27uyiu3hb43uy4iu3',
      shortDesc: 'COM',
      userCount: 2,
      description: 'desc',
      color: 'blue'
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

  const labelCreateMock = {
    request: {
      query: LabelCreate,
      variables: {
        shortDesc: 'COM',
      }
    },
    result: {
      data: {
        labelCreate: {label: { id: 'hh27uyiu3hb43uy4iu3', shortDesc: 'COM' }}
      }
    }
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

  it('creating already existing label', async () => {
    const container = render(
      <MockedProvider mocks={[mock, labelCreateMock]} addTypename={false}>
        <CreateLabel
          handleLabelSelect={jest.fn}
          loading={false}
          setLoading={jest.fn}
          setMessage={jest.fn}
        />
      </MockedProvider>
    );

    expect(container.getByTestId("userLabel-creator")).toBeInTheDocument();
    expect(container.queryByTestId("chip-label")).toBeDefined();
    expect(container.queryByTestId("text-field")).toBeDefined();

    const autoComplete = container.queryByTestId("userLabel-creator")
    const input = within(autoComplete).getByRole("textbox");

    userEvent.type(input, 'COM')

    await waitFor(
      () => {
        fireEvent.keyDown(autoComplete, { key: 'ArrowDown' })
        fireEvent.keyDown(autoComplete, { key: 'Enter' })

        expect(input.value).toEqual('COM') 
      },
      { timeout: 200 }
    );
  });

  it('test creating a new label', async () => {
    const container = render(
      <MockedProvider mocks={[mock, anotherLabelCreateMock]} addTypename={false}>
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
    
    userEvent.type(input, 'COM234')

    await waitFor(
      () => {
        fireEvent.keyDown(autoComplete, { key: 'Enter' })

        expect(input.value).toEqual('COM234') 
      },
      { timeout: 200 }
    );
  });
});
