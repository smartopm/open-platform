import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import Loading from '../../components/Loading'
import FormLinkList from '../../components/Forms/FormList'
import { FormsQuery } from '../../graphql/queries'

describe('Form List Component', () => {
  it('should render form without error', async () => {
    const mocks = {
      request: {
        query: FormsQuery,
      },
      result: {
        data: {
          forms: [
            {
                id: "caea7b44-ee95-42a6",
                name: "Lease Form",
                expiresAt: "2020-12-31T23:59:59Z",
                createdAt: "2020-10-07T09:37:03Z"
            },
            {
                id: "3e530432172e",
                name: "Another Form",
                expiresAt: "2020-12-31T23:59:59Z",
                createdAt: "2020-10-07T09:37:03Z"
            },
          ]
        }
      }
    }
    // needs a theme provider to use theme related functions like theme.breakpoints
    const theme = createMuiTheme()
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <FormLinkList userType="admin" />
          </ThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    const loader = render(<Loading />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()
    await waitFor(() => {
        expect(container.queryAllByTestId('community_form')).toHaveLength(2)
        expect(container.queryAllByTestId('community_form_icon')).toHaveLength(2)
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(container.queryAllByTestId('form_name')).toHaveLength(2)
        expect(container.queryAllByTestId('form_name')[0]).toHaveTextContent('Lease Form')
        expect(container.queryAllByTestId('form_name')[1]).toHaveTextContent('Another Form')
      },
      { timeout: 500 }
    )
  })
})
