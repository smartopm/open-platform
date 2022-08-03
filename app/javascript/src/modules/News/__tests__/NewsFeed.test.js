import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import NewsFeed, { PostItemGrid, postsToDisplay } from '../Components/NewsFeed';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Details page for news post content', () => {
  const response = [
    {
      title: 'Test title',
      featured_image: 'https://placeholder.com',
      ID: 23,
    },
    {
      title: 'Test Another title',
      featured_image: 'https://placeholder.com/2342',
      ID: 24,
    },
  ];
  const wpResponse = {
    ID: 208146416,
    name: 'Site Title',
    title: 'Site Title',
    description: '',
    URL: 'https://community.wordpress.com',
    logo: {
      id: 0,
      sizes: [],
      url: '',
    },
    visible: null,
  };
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(wpResponse),
    })
  );
  const mockHistory = {
    push: jest.fn(),
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
    fetch.mockClear();
  });
  it('should include the post details', () => {
    const container = render(
      <MockedThemeProvider>
        <MemoryRouter>
          <PostItemGrid data={response} loading={false} />
        </MemoryRouter>
      </MockedThemeProvider>
    );
    expect(container.queryByText('Test title')).toBeInTheDocument();
    expect(container.queryByText('misc.recent_article')).toBeInTheDocument();
    expect(container.queryByText('Test Another title')).toBeInTheDocument();
    expect(container.queryAllByTestId('tile_image')[0]).toHaveAttribute(
      'src',
      'https://placeholder.com'
    );
    expect(container.queryAllByTestId('tile_image')[1]).toHaveAttribute(
      'src',
      'https://placeholder.com/2342'
    );
    expect(container.queryByTestId('card-title')).toBeInTheDocument();
    expect(container.queryAllByTestId('post_grid_item')[0]).toBeInTheDocument();
    fireEvent.click(container.queryAllByTestId('post_grid_item')[0]);

    expect(mockHistory.push).toBeCalled();
    expect(mockHistory.push).toBeCalledWith('/news/post/23');

    fireEvent.click(container.queryAllByTestId('button')[0]);
    expect(mockHistory.push).toBeCalled();
  });

  it('should not display anything when no data is available', () => {
    const container = render(
      <MockedThemeProvider>
        <PostItemGrid data={[]} loading />
      </MockedThemeProvider>
    );
    expect(container.queryAllByTestId('skeleton')[0]).toBeInTheDocument();
    expect(container.queryByText('Test Another title')).not.toBeInTheDocument();
  });

  it('should render NewsFeed component', async () => {
    const container = render(
      <MockedThemeProvider>
        <NewsFeed wordpressEndpoint="https://wp.com" />
      </MockedThemeProvider>
    );
    await waitFor(() => {
      expect(container.queryByText('misc.recent_article')).toBeInTheDocument();
    }, 10);
  });
  it('should render NewsFeed with error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Something went wrong with Wordpress'))
    );
    const container = render(
      <MockedThemeProvider>
        <NewsFeed wordpressEndpoint="x" />
      </MockedThemeProvider>
    );
    await waitFor(() => {
      expect(container.queryByText('Something went wrong with Wordpress')).toBeInTheDocument();
    }, 10);
  });
  it('should render nothing when no link is provided', async () => {
    const container = render(
      <MockedThemeProvider>
        <NewsFeed wordpressEndpoint="" />
      </MockedThemeProvider>
    );
    await waitFor(() => {
      expect(container.queryByText('misc.recent_article')).not.toBeInTheDocument();
    }, 10);
  });
  it('should return the postsToDisplay', () => {
    const posts = postsToDisplay([], 5);
    expect(posts).toHaveLength(0);
    const otherPosts = [
      {
        categories: {
          Private: false,
        },
        sticky: true,
      },
      {
        categories: {
          Private: false,
        },
        sticky: true,
      },
    ];
    expect(otherPosts).toHaveLength(2);
  });
});
