import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing'
import CustomAutoComplete from '../../../shared/autoComplete/CustomAutoComplete';

describe('CustomAutoComplete component', () => {
    it('should render correctly', () => {
        const props = {
            onChange: jest.fn(),
            isMultiple: true,
            users: []
        }


        const container = render(<MockedProvider><CustomAutoComplete {...props}  /></MockedProvider>)
        expect(container.queryByTestId('autocomplete')).toBeInTheDocument()
    })
})