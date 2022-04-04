import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Loading from '../../../shared/Loading';
import FormLinkList from '../components/FormList';
import { FormsQuery } from '../graphql/forms_queries';
import userMock from '../../../__mocks__/userMock';

describe('Form List Component', () => {
  it('should render form without error', async () => {
    const mocks = {
      request: {
        query: FormsQuery
      },
      result: {
        data: {
          forms: [
            {
              id: 'caea7b44-ee95-42a6',
              name: 'Lease Form',
              expiresAt: '2020-12-31T23:59:59Z',
              createdAt: '2020-10-07T09:37:03Z',
              roles: ['client']
            },
            {
              id: '3e530432172e',
              name: 'Another Form',
              expiresAt: '2020-12-31T23:59:59Z',
              createdAt: '2020-10-07T09:37:03Z',
              roles: ['admin', 'resident']
            }
          ]
        }
      }
    };
    // needs a theme provider to use theme related functions like theme.breakpoints
    const theme = createTheme();
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <FormLinkList userType="admin" community={userMock.user.community.name} />
            </ThemeProvider>
          </StyledEngineProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    const loader = render(<Loading />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    await waitFor(
      () => {
        expect(container.queryAllByTestId('community_form')).toHaveLength(2);
        expect(container.queryAllByTestId('community_form_icon')).toHaveLength(2);
      },
      { timeout: 500 }
    );
    await waitFor(
      () => {
        expect(container.queryAllByTestId('form_name')).toHaveLength(2);
        expect(container.queryAllByTestId('form_name')[0]).toHaveTextContent('Lease Form');
        expect(container.queryAllByTestId('form_name')[1]).toHaveTextContent('Another Form');
      },
      { timeout: 500 }
    );
  });
});
