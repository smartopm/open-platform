import { render } from '@testing-library/react';
import React from 'react';
import SignupDialog from '../../components/AuthScreens/SignupDialog';
import currentCommunityMock from '../../__mocks__/currentCommunity';

describe('SignupDialog', () => {
  it('should render the signup dialog with no errors', () => {
    const handleModal = jest.fn();
    const handleOpen = jest.fn();
    const wrapper = render(
      <SignupDialog
        t={jest.fn(text => text)}
        handleModal={handleModal}
        currentCommunity={currentCommunityMock.result.data.currentCommunity}
        setOpen={handleOpen}
        open
      />
    );
    expect(wrapper.queryByText('common:form_actions.cancel')).toBeInTheDocument();
    expect(wrapper.queryByText('common:form_actions.send_email')).toBeInTheDocument();
    expect(wrapper.queryByText('login.login_google')).toBeInTheDocument();
    expect(wrapper.queryByText('login.login_facebook')).toBeInTheDocument();
    expect(wrapper.queryByText('common:misc:or')).toBeInTheDocument();
    expect(wrapper.queryByText('login.request_login')).toBeInTheDocument();
    expect(wrapper.queryByText('common:form_fields.full_name')).toBeInTheDocument();
    expect(wrapper.queryByText('common:form_fields.email')).toBeInTheDocument();
    expect(wrapper.queryByText('common:form_fields.phone_number')).toBeInTheDocument();
    expect(wrapper.queryByText('How did you hear about Test Community?')).toBeInTheDocument();
    expect(wrapper.queryByText('Why are you interested in Test Community?')).toBeInTheDocument();
    expect(wrapper.queryByText('interest')).toBeInTheDocument();
  });
});
