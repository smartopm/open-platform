/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'
import Disclaimer from '../components/Disclaimer.jsx'

describe('Disclaimer component', function() {
  it("should render 'Disclaimer' text", function() {
    const disclaimerBody = 'Here is the disclaimer body'
    const rendered = shallow(<Disclaimer body={disclaimerBody} />)
    const textContent = rendered.find('.disclaimer').text()

    expect(textContent).toContain('Disclaimer')
    expect(textContent).toContain(disclaimerBody)
  })
})
