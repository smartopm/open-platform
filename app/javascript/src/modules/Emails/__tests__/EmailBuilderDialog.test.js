import React from 'react';
import EmailEditor from 'react-email-editor';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import EmailBuilderDialog from '../components/EmailBuilderDialog';
import EmailTemplatesMutation, { EmailUpdateMutation } from '../graphql/email_mutations';

// this does not help much
jest.mock('react-email-editor')

describe('Email Builder Component', () => {
  const props = {
    open: true,
    initialData: {},
    emailId: '03942342',
    refetchEmails: jest.fn(),
    handleClose: jest.fn()
  };
  const updateRequestMock = {
    request: {
      query: EmailUpdateMutation,
      variables: {
        id: props.emailId,
        body: 'some new template',
        data: { some: 'thing' }
      }
    },
    result: {
      data: {
        emailTemplateUpdate: {
          emailTemplate: {
            id: props.emailId
          }
        }
      }
    }
  };

  const createRequestMock = {
    request: {
        query: EmailTemplatesMutation,
        variables: {
          id: props.emailId,
          name: 'Greet',
          subject: 'template',
          body: 'some new template',
          data: { some: 'thing' }
        }
      },
      result: {
        data: {
          emailTemplateCreate: {
            emailTemplate: {
              id: props.emailId
            }
          }
        }
      }
    };

  it('should render properly', () => {
    const container = render(
      <MockedProvider mocks={[updateRequestMock, createRequestMock]}>
        <BrowserRouter>
          <EmailBuilderDialog {...props} />
        </BrowserRouter>
      </MockedProvider>
    );

    render(<EmailEditor />)
    expect(container.queryByText('Update')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('submit_btn'));
    expect(container.queryByTestId('submit_btn').textContent).toContain('Saving...')

    fireEvent.click(container.queryByTestId('close_btn'))
    expect(props.handleClose).toBeCalled()
  });
});
