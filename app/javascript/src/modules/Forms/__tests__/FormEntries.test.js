import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
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

    const theme = createMuiTheme()
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <FormEntries formId="410ec828efgs" />
          </ThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(() => {
        expect(container.queryAllByTestId('submitted_by')).toHaveLength(1);
        expect(container.queryAllByTestId('submitted_on')).toHaveLength(1);
        expect(container.queryAllByTestId('status')).toHaveLength(1);
        expect(container.queryAllByTestId('submitted_by')[0].textContent).toEqual('John Test');
        expect(container.queryAllByTestId('submitted_on')[0].textContent).toEqual('2021-07-08');
        expect(container.queryAllByTestId('status')[0].textContent).toEqual('pending');
        expect(container.queryAllByTestId('versionNumber')[0].textContent).toEqual("2");
      },
      { timeout: 500 }
    )
  })
})
