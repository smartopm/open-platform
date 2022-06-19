import React from 'react';
import { render } from '@testing-library/react';
import UserFilledForms from '../Components/UserFilledForms';

describe('UserFilledForms component', () => {
  it('should render a list of forms filled by the user', () => {
    const userFormsFilled = [
      {
        id: '1',
        form: {
          name: 'Form One',
          id: '34243242'
        },
        createdAt: '2020-10-10',
        commentsCount: 2
      }
    ];
    const rendered = render(
      <UserFilledForms userFormsFilled={userFormsFilled} userId="3954jefsdfs" currentUser="9238492318921"  />
    );
    expect(rendered.queryByText('Form One')).toBeInTheDocument();
    expect(rendered.queryByText('2020-10-10')).toBeInTheDocument();
  });
  it('should not contain form list when list is empty', () => {
    const rendered = render(<UserFilledForms userFormsFilled={[]} userId="3954jefsdfs" currentUser="9238492318921" />);
    expect(rendered.queryByText('misc.no_forms')).toBeInTheDocument();
    expect(rendered.queryByTestId('form_item')).not.toBeInTheDocument();
  });
});
