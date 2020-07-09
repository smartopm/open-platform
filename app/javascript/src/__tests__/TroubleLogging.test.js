import React from 'react'
import { render } from '@testing-library/react'
import { LoginScreen } from '../components/AuthScreens/LoginScreen';
import { MockedProvider } from '@apollo/react-testing'
import { MemoryRouter } from 'react-router';

describe('Tests email request on the login screen', () => {

    it('it should render the button correctly', () => {

        const container = render(
            <MockedProvider mock={[]}>
                <MemoryRouter>
                    <LoginScreen />
                </MemoryRouter>
            </MockedProvider>)
        expect(container.queryByTestId('trouble-logging-div')).toBeTruthy()
        expect(container.queryByText('Trouble logging in?')).toBeTruthy()
    });


});
