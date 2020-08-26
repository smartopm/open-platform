/* eslint-disable */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import TaskForm from '../components/Notes/TaskForm'

describe('task form component', () => {
    it('should render and have editable fields', () => {
        const container = render(<MockedProvider><TaskForm /></MockedProvider>)
        expect(container.queryByText('Create Task')).toBeInTheDocument()
        
        const description = container.queryByLabelText('task_description')
        const submitBtn = container.queryByLabelText('task_submit')
        const cancelBtn = container.queryByLabelText('task_cancel')

        fireEvent.change(description, { target: { value: 'This is a description of the task' } })
        expect(description.value).toBe('This is a description of the task')

        expect(container.queryByText('Task Status')).toBeInTheDocument()
        expect(submitBtn.textContent).toContain('Create Task')
        expect(cancelBtn.textContent).toContain('Cancel')
        expect(cancelBtn).not.toBeDisabled()
        expect(submitBtn).not.toBeDisabled()
    })
})
