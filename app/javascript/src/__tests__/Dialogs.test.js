import React from 'react'
import { render } from '@testing-library/react'

import { ModalDialog, CustomizedDialogs } from '../components/Dialog'
import { Spinner } from '../shared/Loading';

describe('Deny Dialog component', () => {
  const dialogProps = {
    handleClose: jest.fn(),
    open: false,
    handleConfirm: jest.fn(),
    action: 'deny',
    name: 'grant'
  }

  it('should render the deny dialog properly with props', () => {
    dialogProps.open = true;

    const container = render(
      <ModalDialog {...dialogProps}>
        <p>Simple Deny Dialog</p>
      </ModalDialog>)
    
    expect(container.queryByText('Simple Deny Dialog')).toBeInTheDocument()
    expect(container.getAllByText('logbook.grant_deny_access')[0]).toBeInTheDocument()
    expect(container.getAllByText(/grant/ig)[0]).toBeInTheDocument()
    expect(container.queryAllByText('deny')[0]).toBeInTheDocument()
    expect(container.queryAllByText('common:form_actions.cancel')[0]).toBeInTheDocument()
  });

  it('should not render when open is false', () => {
    dialogProps.open = false;

    const container = render(
      <ModalDialog {...dialogProps}>
        <p>Simple Deny Dialog</p>
      </ModalDialog>)
    
    expect(container.queryByText('Simple Deny Dialog')).toBeNull()
    expect(container.queryByText('logbook.grant_deny_access')).toBeNull()
    expect(container.queryByText(/grant/ig)).toBeNull()
    expect(container.queryByText('deny')).toBeNull()
    expect(container.queryByText('common:form_actions.cancel')).toBeNull()
  });

  it('should contain deny text', () => {
    dialogProps.open = true;

    const container = render(
      <ModalDialog {...dialogProps} />)
    
    expect(container.getAllByText('logbook.grant_deny_access')[0]).toBeInTheDocument()
    expect(container.getAllByText(/grant/ig)[0]).toBeInTheDocument()
  });

  it('should render action buttons', () => {
    dialogProps.open = true;

    const container = render(
      <ModalDialog {...dialogProps} />)
    
    expect(container.queryAllByText('deny')[0]).toBeInTheDocument()
    expect(container.queryAllByText('common:form_actions.cancel')[0]).toBeInTheDocument()
  });
})

describe('Customized Dialogs', () => {
  const dialogProps = {
    open: true,
    handleBatchFilter: jest.fn(),
    handleModal: jest.fn(),
    dialogHeader: 'Test Header',
    subHeader: '',
    disableActionBtn: false,
    actionable: true,
    actionLoading: false,
  }
  it('should render the customized dialog properly with props', () => {
    const container = render(
      <CustomizedDialogs {...dialogProps}>
        <p>Simple Customized Dialog</p>
      </CustomizedDialogs>)
    expect(container.queryByText('Simple Customized Dialog')).toBeInTheDocument()
    expect(container.queryByText('Test Header')).toBeInTheDocument()
    expect(container.queryByTestId('custom-dialog-button')).toBeInTheDocument()
  });

  it('should not show action buttons when actionable is false', () => {
    dialogProps.actionable = false;

    const container = render(
      <CustomizedDialogs {...dialogProps}>
        <p>Simple Customized Dialog</p>
      </CustomizedDialogs>)

    expect(container.queryByTestId('custom-dialog-button')).toBeNull()
  });

  it('should render loader when action button is clicked', () => {
    dialogProps.actionLoading = true;

    const container = render(
      <CustomizedDialogs {...dialogProps}>
        <p>Simple Customized Dialog</p>
      </CustomizedDialogs>)

    expect(container.queryByTestId('custom-dialog-button')).toBeNull()
    const loader = render(<Spinner />);
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
  })
})