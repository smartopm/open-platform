// The file should be moved to shared directory

import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import ImageAuth from '../../shared/ImageAuth';
import '@testing-library/jest-dom/extend-expect';
import { Spinner } from '../../shared/Loading';
import { CurrentCommunityQuery } from '../../modules/Community/graphql/community_query';

describe('ImageAuth Component', () => {
  it('should render image or text', async () => {
    const props = {
      imageLink: 'http://image.url',
      token: '9234jsdnfsjd2-232ds'
    };
    const mocks = {
      request: {
        query: CurrentCommunityQuery
      },
      result: {
        data: {
          currentCommunity: {
            imageUrl: 'https://dev.dgdp.site/rails/active_storage/blobs/eyJ.png',
            id: '8d66a68a-ded4-4f95-b9e2-62811d2f395f',
            name: 'Doublegdp'
          }
        }
      }
    };
    let wrapper;
    await act(async () => {
      wrapper = render(
        <MockedProvider mock={[mocks]}>
          <ImageAuth {...props} />
        </MockedProvider>
      );
    });
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(wrapper.queryByTestId('community_name')).toBeInTheDocument();
    }, 10);
  });
});
