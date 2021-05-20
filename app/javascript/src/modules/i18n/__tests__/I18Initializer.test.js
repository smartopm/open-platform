import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import I18Initializer from '../Components/I18Initializer';
import { CurrentCommunityQuery } from '../../Community/graphql/community_query';


jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    };
  }
}));

describe('I18n Initializer component', () => {
  it('renders with no errors', () => {
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
            tagline: 'This is a tagline for this community',
            logoUrl: '',
            language: 'en-US',
            features: []
          }
        }
      }
    };
    // this is a dummy component so we don't get expect much from it
    render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <I18Initializer />
      </MockedProvider>
    );
  });
});
