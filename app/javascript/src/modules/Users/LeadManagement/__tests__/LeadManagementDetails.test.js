import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import authState from '../../../../__mocks__/authstate';
import LeadManagementDetails from '../Components/LeadManagementDetails';

describe('LeadManagementDetails Page', () => {
  it('LeadManagementDetails component', async () => {
    render(
      <MockedProvider>
        <LeadManagementDetails userId={authState?.user?.id} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('lead-management-container-header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.main_header')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-tabs')).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-details-tab')).toBeInTheDocument();
      // expect(screen.queryByTestId('lead-management-task-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-note-tab')).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-form')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-main-contact-section')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-lead-information-section')).toBeInTheDocument();

      expect(
        screen.queryByTestId('lead-management-secondary-info-section-header')
      ).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-company-section')).toBeInTheDocument();
    }, 10);
  });
});
