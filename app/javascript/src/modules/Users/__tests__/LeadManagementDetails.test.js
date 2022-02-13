import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import LeadManagementDetails from '../Components/LeadManagementDetails';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('LeadManagementDetails Page', () => {
  it('LeadManagementDetails component', async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <LeadManagementDetails userId={authState?.user?.id} />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('lead-management-container')).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-container-header')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-tabs')).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-details-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-task-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-note-tab')).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-form')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-main-contact-section')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-lead-information-section')).toBeInTheDocument();

      expect(
        screen.queryByTestId('lead-management-secondary-info-section-header')
      ).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-company-section')).toBeInTheDocument();
    }, 30000);
  });
});
