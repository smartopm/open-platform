import React from 'react'
import { mount } from 'enzyme'
import IframeContainer from '../components/IframeContainer'

describe('iframe container component', () => {
  const props = {
    link: 'https://app.doublegdp.com/',
    height: 200,
    width: 345
  }
  // it should render perfectly
  const iframe = mount(<IframeContainer {...props} />)
  it('renders correctly', () => {
    expect(iframe).toMatchSnapshot()
  })
  it('gets the correct props', () => {
    const { link, height, width } = iframe.props()
    expect(link).toBe(props.link)
    expect(height).toBe(props.height)
    expect(width).toBe(props.width)
  })
})
