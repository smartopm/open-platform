import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';

import EditModal from '../Components/EditModal';
import { LabelEdit, LabelCreate } from '../../../graphql/mutations';
import { Spinner } from '../../../shared/Loading';
import { SnackbarContext } from '../../../shared/snackbar/Context';
import { mockedSnackbarProviderProps } from '../../__mocks__/mock_snackbar';

describe('Label Edit Component', () => {
  const mocks = {
    request: {
      query: LabelEdit,
      variables: {
        id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
        shortDesc: 'whgeukhw',
        description: 'This',
        color: '#fff'
      }
    },
    result: {
      data: {
        labelUpdate: {
          label: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3', shortDesc: 'whgeukhw',__typename: 'typename' },
          __typename: 'typename'
        }
      }
    }
  };
  const editMocks = {
    request: {
      query: LabelCreate,
      variables: { shortDesc: 'whgeukhw', description: 'This', color: '#fff' }
    },
    result: {
      data: {
        labelCreate: {
          label: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4', shortDesc: 'whgeukhw', __typename: 'typename' },
          __typename: 'typename'
        }
      }
    }
  };
  const handleClose = jest.fn;
  const open = true;
  const data = {
    id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
    shortDesc: 'whgeukhw',
    color: '#fff',
    description: 'This'
  };

  it('render without error', async () => {
    const container = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <EditModal
            open={open}
            data={data}
            handleClose={handleClose}
            refetch={jest.fn}
            type="edit"
          />
        </BrowserRouter>
      </MockedProvider>
    );

    const title = container.queryByTestId('title');
    const description = container.queryByTestId('description');
    const color = container.queryByTestId('color');

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(color).toBeInTheDocument();

      fireEvent.change(title, { target: { value: 'title' } });
      expect(title.value).toBe('title');

      fireEvent.change(description, { target: { value: 'description' } });
      expect(description.value).toBe('description');

      fireEvent.change(color, { target: { value: '#fff' } });
      expect(color.value).toBe('#fff');

      const button = container.queryByTestId('custom-dialog-button');
      fireEvent.click(button);
      const loader = render(<Spinner />);
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

      await waitFor(
        () => {
          expect(container.queryByText('Delete Campaign')).not.toBeInTheDocument();
        },
        { timeout: 100 }
      );
  });

  it('render with error', async () => {
    const errorMocks = {
      request: {
        query: LabelEdit,
        variables: { id: '', shortDesc: '', description: '', color: '' }
      },
      result: {
        data: {
          labelUpdate: {
            label: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4', __typename: 'typename' },
            __typename: 'typename'
          }
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[errorMocks]}>
        <BrowserRouter>
          <EditModal
            open={open}
            data={data}
            handleClose={handleClose}
            refetch={jest.fn}
            type="edit"
          />
        </BrowserRouter>
      </MockedProvider>
    );

    const title = container.queryByTestId('title');
    const description = container.queryByTestId('description');
    const color = container.queryByTestId('color');

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(color).toBeInTheDocument();

      fireEvent.change(title, { target: { value: 'title' } });
      expect(title.value).toBe('title');

      fireEvent.change(description, { target: { value: 'description' } });
      expect(description.value).toBe('description');

      fireEvent.change(color, { target: { value: 'color' } });
      expect(color.value).toBe('color');

      const button = container.queryByTestId('custom-dialog-button');
      fireEvent.click(button);
      const loader = render(<Spinner />);
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

      await waitFor(
        () => {
          expect(container.queryByText('Delete Campaign')).not.toBeInTheDocument();
        },
        { timeout: 100 }
      );
  });

  it('render editModal components', async () => {
    const container = render(
      <MockedProvider mocks={[mocks, editMocks]}>
        <BrowserRouter>
          <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
            <EditModal
              open={open}
              handleClose={handleClose}
              refetch={jest.fn}
              data={data}
              type="new"
            />
          </SnackbarContext.Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    const title = container.queryByTestId('title');
    const description = container.queryByTestId('description');
    const color = container.queryByTestId('color');

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(color).toBeInTheDocument();

      const button = container.queryByTestId('custom-dialog-button');
      fireEvent.click(button);
      const loader = render(<Spinner />);
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

      await waitFor(
        () => {
          expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
            type: mockedSnackbarProviderProps.messageType.success,
            message: 'label.label_created'
          });
        },
        { timeout: 100 }
      );
  });

  it('render with  create label error', async () => {
    const errorMocks = {
      request: {
        query: LabelCreate,
        variables: { shortDesc: '', description: '', color: '' }
      },
      result: {
        data: {
          labelCreate: {
            label: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4', __typename: 'typename' },
            __typename: 'typename'
          }
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[errorMocks]}>
        <BrowserRouter>
          <EditModal
            open={open}
            data={data}
            handleClose={jest.fn()}
            refetch={jest.fn}
            type="new"
          />
        </BrowserRouter>
      </MockedProvider>
    );

    const title = container.queryByTestId('title');
    const description = container.queryByTestId('description');
    const color = container.queryByTestId('color');

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(color).toBeInTheDocument();

    const button = container.queryByTestId('custom-dialog-button');
    fireEvent.click(button);
    const loader = render(<Spinner />);
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('Delete Campaign')).not.toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
