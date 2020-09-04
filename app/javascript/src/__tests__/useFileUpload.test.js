/* eslint-disable */
// Mock out browser File to prevent errors on import
global.File = {
  prototype: {
    slice: () => {}
  }
}

import React from 'react'
import { shallow } from 'enzyme'
import { AttachAvatar } from '../graphql/mutations'

// TODO: @mdp - more robust testing using fetch and mocks
test('very basic API', () => {
  const UploadTest = () => {
    const { onChange } = useFileUpload({
      updateGQL: AttachAvatar,
      id: '12345abc',
      client: () => {}
    })
    expect(onChange).toBeDefined()
    expect(onChange).toBeInstanceOf(Function)
  }

  // Import after File mock has been made
  const { useFileUpload } = jest.requireActual('../graphql/useFileUpload')
  shallow(<UploadTest />)
})
