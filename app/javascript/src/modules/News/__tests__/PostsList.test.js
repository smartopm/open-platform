/* eslint-disable no-unused-expressions */
import React from 'react'
import { render } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import  { useFetch }  from '../../../utils/customHooks'
import PostsList from '../Components/PostList'

jest.mock('../../../utils/customHooks')

describe("Posts List Component",() => {
  useFetch.mockReturnValue({
    error: null,
    data: {
      results: [
        {
            ID: 13,
            URL: "https://doublegdp.wpcomstaging.com/2020/09/30/rewards-countdown/",
            excerpt: "<p>The moment has finally come. This year, Nkwashi wants to celebrate the holiday spirit with the people we consider family and share th…",
            featured_image: "https://i0.wp.com/doublegdp.wpcomstaging.com/wp-content/uploads/2020/09/rewards2.png?fit=595%2C842&ssl=1",
            slug: "rewards-countdown",
            title: "Rewards Programs",
            modified: "2020-10-01T01:27:10-07:00"
        }
      ]
    }
  });

  it('should render without error and have all Posts', () => {
     const container =  render(
       <MockedProvider mocks={[]}>
         <BrowserRouter>
           <PostsList wordpressEndpoint="https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com" communityName="Demo" />
         </BrowserRouter>
       </MockedProvider>
     )
     expect(useFetch).toBeCalledWith("https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/posts/?number=20&page=1&category=");
     expect(container).toMatchSnapshot();
  })
})
