import React from 'react'
import { render } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import Comments from '../components/Comments/CommentList'

describe('It should test the comment component', () => {
  const data = [
      {
      content: "ghyw",
      id: "khjherf",
      createdAt: "2020-11-13T10:53:16Z",
      user: {
        name: "jhjhfwe",
        id: '234'
      },
      discussion: {
        id: "2374",
        postId: "774r"
      }
    }
  ]

  it('should render with no error', () => {
     const container = render(
       <BrowserRouter>
         <MockedProvider>
           <Comments data={data} />
         </MockedProvider>
       </BrowserRouter>
    )

    expect(container.getByTestId("content")).toBeInTheDocument()
  });
});