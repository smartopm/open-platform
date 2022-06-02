import React from 'react';
import { render } from '@testing-library/react';
import UserFilledForms from '../Components/UserFilledForms';


describe('UserFilledForms component', () => {
  it('should render a list of forms filled by the user', () => {
    const userFormsFilled = [
      {
        id: '123abc456',
        form: {
          name: 'Form One'
        },
        status: 'pending',
        createdAt: '2020-10-10'
      }
    ];
    const rendered = render(
      <UserFilledForms userFormsFilled={userFormsFilled} userId="3954jefsdfs" currentUser="9238492318921"  />
    );
    expect(rendered.queryByText('Form One')).toBeInTheDocument();
    expect(rendered.queryByText('pending')).toBeInTheDocument();
    expect(rendered.queryByText('2020-10-10')).toBeInTheDocument();
    const item = rendered.queryByTestId('form_item');
    expect(item).not.toBeDisabled();
    expect(item).toBeInTheDocument();
  });
  it('shouldnt contain form list when list is empty', () => {
    const rendered = render(<UserFilledForms userFormsFilled={[]} userId="3954jefsdfs" currentUser="9238492318921" />);
    expect(rendered.queryByText('misc.no_forms')).toBeInTheDocument();
    expect(rendered.queryByTestId('form_item')).not.toBeInTheDocument();
  });

  it('shouldnt render an entry if it is draft', () => {
    const userForms = [
      {
        id: '123abc456',
        form: {
          name: 'Form One'
        },
        userId: '456fgetr6',
        status: 'draft',
        createdAt: '2020-10-10'
      }
    ];
    const rendered = render(<UserFilledForms userFormsFilled={userForms} userId="3954jefsdfs" currentUser="9238492318921" />);
    expect(rendered.queryByText('Form One')).not.toBeInTheDocument();
  });

  it('shouldnt render a draft entry if current-user is the owner', () => {
    const userForms = [
      {
        id: '123abc456',
        form: {
          name: 'Form One'
        },
        userId: '456fgetr6',
        status: 'draft',
        createdAt: '2020-10-10'
      }
    ];
    const rendered = render(
      <UserFilledForms userFormsFilled={userForms} userId="3954jefsdfs" currentUser="456fgetr6" />
    );
    expect(rendered.queryByText('Form One')).toBeInTheDocument();
    expect(rendered.queryByText('draft')).toBeInTheDocument();
    expect(rendered.queryByText('2020-10-10')).toBeInTheDocument();
  });
});
