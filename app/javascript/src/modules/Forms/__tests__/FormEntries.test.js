import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import Loading from '../../../shared/Loading';
import FormEntries from '../components/FormEntries';
import { FormEntriesQuery } from '../graphql/forms_queries';


describe('Form Entries Component', () => {
  it('should render form without error', async () => {
    const mocks = {
      request: {
        query: FormEntriesQuery,
        variables: {
            formId: "410ec828efgs",
            query: '',
            limit: 50,
            offset: 0
        }
      },
      result: {
        data: {
          formEntries:
            {
                formName: "Lease Form",
                formUsers: [{
                    id: "3e530432172e",
                    userId: "4e530435dse",
                    formId: "7g556934545dd",
                    status: "pending",
                    createdAt: "2021-07-08T12:07:56+02:00",
                    user: {
                        id: "410ec828efgs",
                        name: "John Test",
                        imageUrl: 'http://host.com/image.jpg'
                    },
                    form: {
                        id: "410ec828efgs",
                        versionNumber: 2,
                    },
                }]
            }
        }
      }
    }
    window.open = jest.fn();
    const spyWindowOpen = jest.spyOn(window, 'open');
    const theme = createTheme()
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <FormEntries formId="410ec828efgs" />
            </ThemeProvider>
          </StyledEngineProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

  await waitFor(() => {
      expect(container.queryAllByTestId('submitted_by')).toHaveLength(1);
      expect(container.queryAllByTestId('submitted_on')).toHaveLength(1);
      expect(container.queryAllByTestId('status')).toHaveLength(1);
      expect(container.queryAllByTestId('download')).toHaveLength(1);
      expect(container.queryAllByTestId('DownloadIcon')).toHaveLength(1);
      expect(container.queryAllByTestId('submitted_on')[0].textContent).toEqual('2021-07-08');
      expect(container.queryAllByTestId('status')[0].textContent).toEqual('pending');
      expect(container.queryAllByTestId('versionNumber')[0].textContent).toEqual("2");
      fireEvent.click(container.queryAllByTestId('DownloadIcon')[0]);
      expect(spyWindowOpen).toHaveBeenCalled();
    },
  { timeout: 500 })
  })
})
