import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import Comments from '../components/Comments/Comments'
import { CommentsPostQuery } from '../graphql/queries'

describe('It should test the comment component', () => {
  const mockData = {
    request: {
      query: CommentsPostQuery,
      variables: {
        limit: 20,
        offset: 0
      } 
    },
    result: {
      data: {
        fetchComments: [
          {
            id: '12345678890',
            content: "Client",
            createdAt: "2020-11-13T10:53:16Z",
            discussion: {
              id: '74093',
              postId: '2001'
            },
            user: {
              id: '873005',
              name: 'Tolulope Olaniyan'
            }
          }
        ]
      }
    }
  }

  it('it should render with no error', () => {

     render(
       <BrowserRouter>
         <MockedProvider mock={mockData} addTypename={false}>
           <Comments />
         </MockedProvider>
       </BrowserRouter>
    )
  });
});