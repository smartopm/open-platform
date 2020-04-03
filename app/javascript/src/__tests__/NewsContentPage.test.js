import React from 'react'
import { mount } from 'enzyme'
import NewsContentPage, { formatUrl } from '../containers/NewsContentPage'

describe('news content page', () => {
  const page = mount(<NewsContentPage />)
  it('renders and matches the snapshot', () => {
    expect(page).toMatchSnapshot()
  })
  it('should include dom elements when rendered', () => {
    expect(page.find('iframe')).toHaveLength(1)
    expect(page.find('div')).toHaveLength(1)
  })
})

describe('format url function', () => {
  // give a page like this https://olivier.dgdp.site/news/policies/gate-access-policy/
  // should return this policies/gate-access-policy/
  const currentPath =
    'https://olivier.dgdp.site/news/policies/gate-access-policy/'
  it('should extract the url params from the given path', () => {
    expect(formatUrl(currentPath, 'news')).toBe('policies/gate-access-policy/')
  })
  it('should extract the url params from other tags besides news', () => {
    expect(formatUrl(currentPath, 'policies')).toBe('gate-access-policy/')
  })
})
