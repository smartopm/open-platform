import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import VideoCapture, { videoDirection } from '../../Components/VideoCapture';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import { EntryRequestContext } from '../../Context';
import authState from '../../../../../__mocks__/authstate';
import MockedSnackbarProvider from '../../../../__mocks__/mock_snackbar';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Video Capture component', () => {
  it('should render correctly', () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <EntryRequestContext.Provider value={{ request: { id: 'somew2923' }, isGuestRequest: false }}>
                <MockedSnackbarProvider>
                  <VideoCapture handleNext={() => {}} />
                </MockedSnackbarProvider>
              </EntryRequestContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByText('logbook:video_recording.face_left')).toBeInTheDocument();
    expect(container.queryByText('logbook:video_recording.add_video_text')).toBeInTheDocument();
    expect(container.queryByText('logbook:video_recording.create_video_text')).toBeInTheDocument();
    expect(container.queryByTestId('well-lit-txt')).toBeInTheDocument();
    expect(container.queryByTestId('listen-to-counter-txt')).toBeInTheDocument();
    expect(container.queryByTestId('direction-txt')).toBeInTheDocument();
    expect(container.queryByTestId('seconds-txt')).toBeInTheDocument();
    expect(container.queryByTestId('continue-btn')).not.toBeInTheDocument();
    expect(container.queryByTestId('grant_btn')).toBeInTheDocument();
    expect(container.queryByTestId('re_record_video_btn')).not.toBeInTheDocument();
    expect(container.queryByTestId('video_recorder')).toBeInTheDocument();
  });
});

describe('VideoDirection function', () => {
  it('should return respective direction texts and images', () => {
    const container = videoDirection(() => {});
    expect(render(container.left).queryByTestId('face-left-txt')).toBeInTheDocument();
    expect(render(container.left).queryAllByTestId('face-left-img')[0]).toBeInTheDocument();
    expect(render(container.right).queryByTestId('face-right-txt')).toBeInTheDocument();
    expect(render(container.right).queryAllByTestId('face-right-img')[0]).toBeInTheDocument();
    expect(render(container.forward).queryByTestId('face-forward-txt')).toBeInTheDocument();
    expect(
      render(container.forward).queryAllByTestId('face-forward-img')[0]
    ).toBeInTheDocument();
    expect(render(container.done).queryByTestId('done-txt')).toBeInTheDocument();
  });
});
