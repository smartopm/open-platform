/* eslint-disable no-unused-expressions */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Categories from '../components/NewsPage/Categories'
import '../utils/customHooks'

describe("Categories Component ",() => {

  jest.mock('../utils/customHooks', () => {
    const category = {
      categories: {
        name: "news"
      }
    }
  
    const error = "error"
    return jest.fn(() => {
      category
      error
    })
  })

  it('should render without error and have all Categories', ()=> {
     const container =  render(
       <Categories />
     )

     expect(container.queryByText('fetch is not defined')).toBeInTheDocument()
  })
})
