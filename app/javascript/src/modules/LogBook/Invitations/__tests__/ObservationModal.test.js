import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { useTranslation } from 'react-i18next';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import ObservationModal from '../Components/ObservationModal';

describe('ObservationModal Component', () => {
  const { t } = useTranslation(['common', 'logbook']);
  const props = {
    isObservationOpen: true,
    handleCancelClose: jest.fn(),
    observationNote: 'Note',
    setObservationNote: jest.fn(),
    imageUrls: [],
    onChange: jest.fn(),
    status: '',
    handleCloseButton: jest.fn(),
    observationDetails: {loading: true},
    t,
    handleSaveObservation: jest.fn(),
  };

  it('should render loader component when observation details is loading', () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <MockedThemeProvider>
            <ObservationModal {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getAllByTestId('loader').length).toBeGreaterThan(0);
  });

  it('should render observation modal for creating an observation', () => {
    const newProps = { ...props, observationDetails: { loading: false } }
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <MockedThemeProvider>
            <ObservationModal {...newProps} />
          </MockedThemeProvider>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getByTestId('entry-dialog')).toBeInTheDocument();
    expect(container.getByTestId('entry-dialog-title')).toBeInTheDocument();
    expect(container.getByTestId('entry-dialog-close-icon')).toBeInTheDocument();
    expect(container.getByTestId('CloseIcon')).toBeInTheDocument();
    expect(container.getByText('observations.add_your_observation')).toBeInTheDocument();
    expect(container.getAllByText('logbook.add_observation').length).toBeGreaterThan(0);
    expect(container.getByText('observations.observation_title')).toBeInTheDocument();
    expect(container.getByText('observations.observation_title')).toBeInTheDocument();
    expect(container.getByText('Note')).toBeInTheDocument();
    expect(container.getByTestId('entry-dialog-field')).toBeInTheDocument();
    expect(container.getAllByTestId('upload_button').length).toBeGreaterThan(0);
    expect(container.getByTestId('upload_label')).toBeInTheDocument();
    expect(container.getByTestId('save')).toBeInTheDocument();
  });
});
