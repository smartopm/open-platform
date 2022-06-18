import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import FormUserItem from '../Components/FormUserItem';
import userMock from '../../../../__mocks__/authstate';

describe('FormUser Item', () => {
  const props = {
    formUser: {
      id: '1',
      form: {
        name: 'Test Form',
        id: '34243242'
      },
      createdAt: '2020-01-01',
      commentsCount: 2
    },
    handleShowComments: jest.fn(),
    currentFormUserId: '1',
    userId: '902384023-2343',
    formData: {
      loading: false,
      refetch: jest.fn(),
      data: {
        formComments: [
          {
            id: 'som909-isjd',
            body: 'This is a test comment',
            user: {
              id: 'efs-isjd',
              imageUrl: 'image.jpg',
              userType: 'client'
            }
          }
        ]
      }
    }
  };
  const translate = jest.fn(() => 'Translated');
  it('should render with no errors', () => {
    const wrapper = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <FormUserItem {...props} t={translate} />
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(wrapper.queryByTestId('form_user_item')).toBeInTheDocument();
    expect(wrapper.queryByTestId('disc_title')).toBeInTheDocument();
    expect(wrapper.queryByTestId('disc_title').textContent).toContain('Test Form');
    expect(wrapper.queryByTestId('show_comments')).toBeInTheDocument();
    expect(wrapper.queryByTestId('comments_badge')).toBeInTheDocument();
    expect(wrapper.queryByTestId('comments_icon')).toBeInTheDocument();
    expect(wrapper.queryByTestId('submitted_at')).toBeInTheDocument();
    expect(wrapper.queryByText('This is a test comment')).toBeInTheDocument();
  });
  it('should render with no comments', () => {
    const noCommentsProps = {
      formUser: {
        id: '1',
        form: {
          name: 'Test Form',
          id: '34243242'
        },
        createdAt: '2020-01-01',
        commentsCount: 2
      },
      handleShowComments: jest.fn(),
      currentFormUserId: '1',
      userId: '902384023-2343',
      formData: {
        loading: false,
        refetch: jest.fn(),
        data: {
          formComments: []
        }
      }
    };
    const wrapper = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <FormUserItem {...noCommentsProps} t={translate} />
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(wrapper.queryByTestId('centered_content')).toBeInTheDocument();
  });
  it('should render with loading', () => {
    const noCommentsProps = {
      formUser: {
        id: '1',
        form: {
          name: 'Test Form',
          id: '34243242'
        },
        createdAt: '2020-01-01',
        commentsCount: 2
      },
      handleShowComments: jest.fn(),
      currentFormUserId: '1',
      userId: '902384023-2343',
      formData: {
        loading: true,
        refetch: jest.fn(),
        data: {
          formComments: []
        }
      }
    };
    const wrapper = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <FormUserItem {...noCommentsProps} t={translate} />
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(wrapper.queryByTestId('loader')).toBeInTheDocument();
  });
});
