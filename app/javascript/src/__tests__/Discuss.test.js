/* eslint-disable */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Discuss from '../components/Discussion/Discuss'
import { MockedProvider } from '@apollo/react-testing'



describe('Discuss form component', () => {
    it('should render with wrong props', () => {
        const container = render(<MockedProvider><Discuss /></MockedProvider>)
        expect(container.queryByText('common:form_actions.submit')).toBeInTheDocument()

        const title = container.queryByLabelText('discuss_title')
        fireEvent.change(title, { target: { value: 'This is a title' } })
        expect(title.value).toBe('This is a title')
        
        const description = container.queryByLabelText('discuss_description')
        fireEvent.change(description, { target: { value: 'This is a description of the discussion' } })
        expect(description.value).toBe('This is a description of the discussion')
    })
})
