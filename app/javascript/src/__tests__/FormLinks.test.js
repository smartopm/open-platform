import React from 'react' 
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import FormLinkList from '../components/FormLinkList';

describe('Shows the google form links', () => {

    it('It should render with no errors', () => {

        const container = render(
            <FormLinkList />
        )

        expect(container.queryByTestId('forms-crf')).toBeInTheDocument()
        expect(container.queryByTestId('forms-building-permit')).toBeInTheDocument() 
        expect(container.queryByTestId('forms-link-building-permit')).toBeInTheDocument()
    });    
    
});
