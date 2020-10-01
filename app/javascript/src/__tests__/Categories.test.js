/* eslint-disable no-unused-expressions */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Categories from '../components/NewsPage/Categories'
import  { useFetch }  from '../utils/customHooks'
import { sleep } from '../utils/helpers'

jest.mock('../utils/customHooks')

describe("Categories Component ",() => {
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
        },
        {
          ID: 5513,
          description: "This has a decsription",
          feed_url: "https://doublegdp.wpcomstaging.com/category/artists-in-residence/feed/",
          meta: {links: {self: "https://public-api.wordpress.com/rest/v1.1/sites/178950111/categories/slug:artists-in-residence", help: "https://public-api.wordpress.com/rest/v1.1/sites/178950111/categories/slug:artists-in-residence/help", site: "https://public-api.wordpress.com/rest/v1.1/sites/178950111"}},
          name: "Artists In Nkwashi",
          parent: 0,
          post_count: 11,
          slug: "artists-in-nkwashi"
        },
      ]
    }
  });

  it('should render without error and have all Categories', () => {
     const container =  render(<Categories />)
     expect(useFetch).toBeCalledWith("https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/categories");
        sleep(500).then(() => {
          expect(container.queryAllByTestId('post_cat')).toHaveLength(2);
          expect(container.queryAllByTestId('post_cat')[0]).toHaveTextContent("Artists In Residence");
          expect(container.queryAllByTestId('post_cat')[0]).toHaveTextContent("Artists In Nkwashi");
        })
      expect(container).toMatchSnapshot();
  })
})
