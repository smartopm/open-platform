import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import PageWrapper from '../PageWrapper';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('PageWrapper component', () => {
  it('should render without error', () => {
    const props = {
      children: <div>sampleText</div>,
      pageTitle: 'sample_title',
      showAvatar: true,
      breadCrumbObj: {
        extraBreadCrumb: 'sample1',
        extraBreadCrumbLink: '/sample',
        linkText: 'sample_link',
        linkHref: '/samplehref',
        pageName: 'sample_page'
      },
      avatarObj: {
        data: {
          user: {
            imageUrl: 'sample_image.jpg',
            avatarUrl: 'sample_avatar.jpg',
            name: 'sample_name',
            userType: 'admin'
          }
        }
      },
      rightPanelObj: [
        {
          key: 1,
          mainElement: <div>sample</div>
        }
      ]
    };
    const rendered = render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <PageWrapper {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    expect(rendered.queryByText('sampleText')).toBeInTheDocument();
    expect(rendered.queryByTestId('page_container')).toBeInTheDocument();
    expect(rendered.queryByTestId('page_breadcrumb')).toBeInTheDocument();
    expect(rendered.queryByTestId('page_name')).toHaveTextContent('sample_page');
    expect(rendered.queryByTestId('page_title')).toHaveTextContent('sample_title');
    expect(rendered.queryByTestId('page_avatar')).toBeInTheDocument();
    expect(rendered.queryByTestId('right_panel')).toBeInTheDocument();
  });
});
