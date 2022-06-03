import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import UserNotes from '../Components/UserNotes';
import { UserNotesQuery } from '../../../graphql/queries';

describe('user notes component', () => {
  it('should render correct notes details', async () => {
    const notesMock = {
      request: {
        query: UserNotesQuery,
        variables: { userId: 'some29384293812' }
      },
      result: {
        data: {
          userNotes: [
            {
              body: 'am a note',
              completed: false,
              createdAt: '2020-09-09',
              id: '9321938213'
            }
          ]
        }
      }
    };

    const container = render(
      <MockedProvider mocks={[notesMock]} addTypename={false}>
        <UserNotes userId="some29384293812" tabValue={2} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('note_body')).toBeInTheDocument();
      expect(container.queryByTestId('body_input')).toBeInTheDocument();
      expect(container.queryByTestId('comment_btn')).toBeInTheDocument();
      expect(container.queryByTestId('comment_btn')).toBeDisabled();
      expect(container.queryByText('common:form_actions.save')).toBeInTheDocument();
    }, 10);
  });
});
