/* eslint-disable no-unused-expressions */
import React from 'react'
import { render } from '@testing-library/react'

import Categories from '../Components/Categories'
import  { useFetch }  from '../../../utils/customHooks'

jest.mock('../../../utils/customHooks')

describe("Categories Component",() => {
  useFetch.mockReturnValue({
    error: null,
    data: {
      results: [
        {
          ID: 1585513,
          description: "",
          feed_url: "https://doublegdp.wpcomstaging.com/category/artists-in-residence/feed/",
          meta: {links: {self: "https://public-api.wordpress.com/rest/v1.1/sites/178950111/categories/slug:artists-in-residence", help: "https://public-api.wordpress.com/rest/v1.1/sites/178950111/categories/slug:artists-in-residence/help", site: "https://public-api.wordpress.com/rest/v1.1/sites/178950111"}},
          name: "Artists In Residence",
          parent: 0,
          post_count: 11,
          slug: "artists-in-residence"
        }
      ]
    }
  });

  it('should render without error and have all Categories', async () => {
     const container =  render(<Categories wordpressEndpoint="https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com" />)
     expect(useFetch).toBeCalledWith("https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/categories");
      expect(container).toMatchSnapshot();
  })
})
