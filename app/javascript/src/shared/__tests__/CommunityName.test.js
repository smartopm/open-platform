import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import authState from '../../__mocks__/authstate';
import CommunityName from "../CommunityName";
import { Context } from '../../containers/Provider/AuthStateProvider';

describe('CommunityName', () => {
  it('renders community logo', async () => {
    render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <CommunityName authState={authState} logoStyles={{}} />
        </BrowserRouter>
      </Context.Provider>
    );

    expect(await screen.findByAltText('community logo')).toBeInTheDocument();
  });

  it('renders community name when imageUrl is not set', async () => {
    authState.user.community.imageUrl = null;
    render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <CommunityName authState={authState} logoStyles={{}} />
        </BrowserRouter>
      </Context.Provider>
    );

    expect(await screen.findByText('City')).toBeInTheDocument();
  });
});
