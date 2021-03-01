import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { ThemeProvider } from '@material-ui/core';
import FormLinks from '../../containers/Forms/FormLinks';
import { theme } from '../../themes/nkwashi/theme';



jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('FormLinks Component', () => {
  it('renders FormLinks text', () => {
    const container = render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <FormLinks />
          </BrowserRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    expect(container.getByText(/Permits and Request Forms/)).toBeInTheDocument();
  });
});
