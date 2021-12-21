import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import WelcomePage from '../components/AuthScreens/WelcomePage';
import { CurrentCommunityQuery } from '../modules/Community/graphql/community_query';

describe('component that centers divs', () => {
  const mock = {
    request: {
      query: CurrentCommunityQuery
    },
    result: {
      data: {
        currentCommunity: {
          imageUrl: 'https://dev.dgdp.site/rails/active_storage/blobs/eyJ.png',
          id: '8d66a68a-ded4-4f95-b9e2-62811d2f395f',
          name: 'Test Community',
          supportEmail: [{ email: 'support@test.com', category: 'customer_care' }],
          supportWhatsapp: [{ email: 'support@test.com', category: 'customer_care' }],
          supportNumber: [{ email: 'support@test.com', category: 'customer_care' }],
          currency: 'kwacha',
          locale: 'en-ZM',
          gaId: 'G-KAIADJQ',
          tagline: 'This is a tagline for this community',
          logoUrl: '',
          language: 'en-US',
          features: { Dashboard: { features: [] }},
          socialLinks: null,
          menuItems: null,
          wpLink: null,
          themeColors: null,
          securityManager: null,
          templates: null,
          subAdministrator: null,
          bankingDetails: null,
          smsPhoneNumbers: null,
          emergencyCallNumber: null,

        }
      }
    }
  };
  const Welcome = () => (
    <MockedProvider mocks={[mock]} addTypename={false}>
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    </MockedProvider>
  );

  it('should include proper text', () => {
    const container = render(<Welcome />);
    expect(container.queryByText('Here i am')).toBeNull();
    expect(container.queryByText('Here i am')).not.toBeInTheDocument();
  });
  it('should have action button texts', () => {
    const container = render(<Welcome />);
    expect(container.queryByText('Schedule a call')).toBeInTheDocument();
    expect(container.queryByText('Book a tour')).toBeInTheDocument();
    expect(container.queryByText('Become a client')).toBeInTheDocument();
    expect(container.queryByText('Apply for Nkwashi Residency')).toBeInTheDocument();
    expect(container.queryByTestId('contact').textContent).toContain('260 966 194383');
    expect(container.queryByTestId('contact-email').textContent).toContain('hello@thebe-im.com');
    expect(container.queryByTestId('login_btn').textContent).toContain('Login');
    expect(container.queryByTestId('nk_client').textContent).toContain('Already an Nkwashi client');
  });

  it('should have main centered text', () => {
    const container = render(<Welcome />);
    expect(container.queryByTestId('maintext-centered').textContent).toContain(
      "It's not just a house"
    );
  });
  it('should have location text', () => {
    const container = render(<Welcome />);
    expect(container.queryByTestId('locationtext').textContent).toContain('11 Nalikwanda Road');
  });
  it('should have main text', () => {
    const container = render(<Welcome />);
    expect(container.queryByTestId('maintext').textContent).toContain(
      'Nkwashi is a new town that is being developed 36 kilometres east of the City of Lusaka'
    );
  });
  it('should have 7 main buttons', () => {
    const container = render(<Welcome />);
    expect(container.container.getElementsByTagName('button')).toHaveLength(7);
  });
  it('should have an image with a proper url', () => {
    const container = render(<Welcome />);
    expect(container.container.getElementsByTagName('img')[1]).toHaveAttribute(
      'src',
      'https://nkwashi.com/wp-content/uploads/2017/02/home-hero.jpg'
    );
  });
  it('The first image should have a proper alternative text', () => {
    // we could get the path but don't have to
    const container = render(<Welcome />);
    expect(container.container.getElementsByTagName('img')[0]).toHaveAttribute(
      'alt',
      'Nkwashi logo with title'
    );
  });
  it('should have a main nkwashi logo', () => {
    const container = render(<Welcome />);
    expect(container.queryByTestId('nkwashi_logo')).toHaveAttribute('alt', 'community logo');
  });
  it('should have a footer thebe logo', () => {
    const container = render(<Welcome />);
    expect(container.queryByTestId('thebe_logo')).toHaveAttribute('alt', 'thebe logo');
  });
  it('should have copyright text', () => {
    const container = render(<Welcome />);
    expect(container.queryByTestId('copyright_text').textContent).toContain(
      '©2017. Thebe Investment Management Limited. All Rights Reserved'
    );
  });
  it('should have social links', () => {
    const container = render(<Welcome />);
    expect(container.queryByTestId('ld_follow')).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/10478892'
    );
    expect(container.queryByTestId('fb_like')).toHaveAttribute(
      'href',
      'https://www.facebook.com/nkwashi.soar/'
    );
    expect(container.queryByTestId('ld_follow').textContent).toContain('Follow us');
    expect(container.queryByTestId('fb_like').textContent).toContain('Like');
  });
});
