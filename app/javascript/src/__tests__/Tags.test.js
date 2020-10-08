import React from 'react'
import { render } from '@testing-library/react'
import TagPosts from '../components/NewsPage/Tags'
import '@testing-library/jest-dom/extend-expect'

describe('Tags Component', () => {
  const tags = {
    tag1: {
      sample: 'sample'
    },
    tag2: {
      sample: 'sample'
    }
  }

  it('render without error', () => {
    render(
      <TagPosts
        tags={tags}
      />
    )
  })
})