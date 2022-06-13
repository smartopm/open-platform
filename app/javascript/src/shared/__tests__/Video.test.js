import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { useFetchMedia } from '../../utils/customHooks';
import Video from "../Video";
import { Context } from '../../containers/Provider/AuthStateProvider';
import userMock from '../../__mocks__/userMock';

jest.mock('../../utils/customHooks')
describe('Video Component', () => {
  it('should fetch the media url', async () => {
      useFetchMedia.mockReturnValue({
        error: null,
        loading: false,
        response: {
          url: 'https://some.video.coom'
        }
      });
    const container = render(
      <Context.Provider value={userMock}>
        <Video src="https://some.video.coom" />
      </Context.Provider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('video_component')).toBeInTheDocument();
      expect(useFetchMedia).toBeCalled();
      expect(useFetchMedia).toBeCalledWith(
        "https://some.video.coom",
        expect.objectContaining({ "method": "GET" })
      )
    });
  });
});
