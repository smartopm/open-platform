import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import VerificationStepContainer from '../../Containers/VerificationStepContainer';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import authstate from '../../../../../__mocks__/authstate';
import { EntryRequestContext } from '../../Context';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Guest Validate component', () => {
  it('should render correctly', () => {
    const container = render(
      <Context.Provider value={authstate}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <EntryRequestContext.Provider
                value={{
                request: {
                  id: 'someids',
                  status: 'pending',
                  imageUrls: null,
                  videoUrl: null
                }
              }}
              >
                <VerificationStepContainer />
              </EntryRequestContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryAllByTestId('step_button')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('step_button')).toHaveLength(4);
  });
});
