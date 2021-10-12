import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import VideoCapture from '../../Components/VideoCapture';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import userMock from '../../../../../__mocks__/userMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Video Capture component', () => {
  it('should render correctly', () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <VideoCapture handleNext={() => {}} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByText('logbook:video_recording.face_left')).toBeInTheDocument();
    expect(container.queryByText('logbook:video_recording.add_video_text')).toBeInTheDocument();
    expect(container.queryByText('logbook:video_recording.create_video_text')).toBeInTheDocument();
    expect(container.queryByTestId('be-sure-txt')).toBeInTheDocument();
    expect(container.queryByTestId('well-lit-txt')).toBeInTheDocument();
    expect(container.queryByTestId('listen-to-counter-txt')).toBeInTheDocument();
    expect(container.queryByTestId('direction-txt')).toBeInTheDocument();
    expect(container.queryByTestId('seconds-txt')).toBeInTheDocument();
    expect(container.queryByTestId('continue-btn')).not.toBeInTheDocument();
  });
});
