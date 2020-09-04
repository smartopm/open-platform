/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'
import { ModalDialog } from '../components/Dialog'

describe('Deny Dialog component', () => {
  const dialogProps = {
    handleClose: jest.fn(),
    open: false,
    handleConfirm: jest.fn(),
    action: 'deny',
    name: 'olivier'
  }
  const dialogWrapperWithProps = shallow(<ModalDialog {...dialogProps} />)
  it('should render the deny dialog properly with props', () => {
    const { open, children, handleClose } = dialogWrapperWithProps.props()
    expect(open).toBe(false)
    expect(handleClose).toBeUndefined()
    expect(children).toHaveLength(2)
  })
  it('should contain deny text', () => {
    expect(dialogWrapperWithProps.find('.deny-msg')).toBeTruthy()
    expect(dialogWrapperWithProps.text()).toContain(
      'Are you sure you want to deny access to olivier'
    )
  })
  it('should have buttons', () => {
    dialogWrapperWithProps.find('.btn-close').simulate('click')
    expect(dialogProps.handleClose).toHaveBeenCalled()
    expect(dialogWrapperWithProps.find('button')).toBeTruthy()
  })
})
