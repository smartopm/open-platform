import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { act, render, fireEvent, waitFor } from '@testing-library/react'

import Tag from '../Components/Tag'
import TagPosts from '../Components/TagPosts'
import { PostTagUser } from '../../../graphql/queries'
import  { useFetch }  from '../../../utils/customHooks'

jest.mock('../../../utils/customHooks')
const mck = jest.fn()

describe('Tags Component', () => {
  it('render without error', () => {
    const container = render(<Tag tag="Architecture"  />)
    expect(container.queryByText('Architecture')).toBeInTheDocument()
  })
})

describe('Tags event', () => {
  it('should handle tag events', () => {
    const handleTagOpen = mck

    const container = render(<Tag tag="Architecture" handleTagOpen={handleTagOpen} />)

    const tagBtn = container.queryByText(/architecture/i)
    expect(tagBtn).toBeTruthy();

    fireEvent.click(tagBtn)
    expect(handleTagOpen).toHaveBeenCalled();
  });
});

describe('TagPosts', () => {
  const props = {
    open: true,
    handleClose: mck,
    tagName: 'architecture',
    wordpressEndpoint: 'https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com'
  }

  const mocks = [
    {
      request: {
        query: PostTagUser,
        variables: {
          tagName: `${props.tagName}`,
        }
      },
      result: {
        data: {
          userTags: {
            id: `${props.tagName}`,
          }
        }
      }
    },
  ]
  useFetch.mockReturnValue({
    error: null,
    response: {
      posts: [
        {
          ID: '123',
          title: 'Post on Architecture',
          featured_image: 'https://image.irl',
          modified: new Date(),
          excerpt: ''
        }
      ]
    }
  })

  it('should render posts for a tag', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider
          mocks={mocks}
          addTypename={false}
        >
          <TagPosts {...props} />
        </MockedProvider>
      )
    })

    expect(useFetch).toBeCalledWith(`https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/posts/?tag=${props.tagName}`);
    expect(container.queryByText(/news.related_posts/)).toBeInTheDocument()
    await waitFor(() => {
      expect(container.queryByTestId('follow_btn').textContent).toContain('news.unfollow_tag')
      expect(container.queryByText(/Post on Architecture/i)).toBeInTheDocument()
    }, 10)
  });
});