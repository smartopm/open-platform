import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import GuestForm from '../../Components/GuestForm';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import userMock from '../../../../../__mocks__/userMock'
import { EntryRequestContext } from '../../Context'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Guest Form component', () => {
  it('should render correctly', () => {
    const next = jest.fn()
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <EntryRequestContext.Provider value={{ request: { id: 'someids' } }}>
                <GuestForm handleNext={next} />
              </EntryRequestContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByText('form_fields.full_name')).toBeInTheDocument();
  });
});
