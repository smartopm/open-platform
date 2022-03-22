import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import TaskForm from '../Components/TaskForm'

describe('task form component', () => {
    it('should render and have editable fields', () => {
        const props = {
            refetch: jest.fn(),
            close: jest.fn(),
            assignUser: jest.fn(),
            data: {},
            users: []
        }
        const container = render(<MockedProvider><TaskForm {...props}  /></MockedProvider>)
        expect(container.queryByText('common:form_actions.create_task')).toBeInTheDocument()

        const description = container.queryByLabelText('task_description')
        const submitBtn = container.queryByLabelText('task_submit')
        const cancelBtn = container.queryByLabelText('task_cancel')

        fireEvent.change(description, { target: { value: 'This is a description of the task' } })
        expect(description.value).toBe('This is a description of the task')

        expect(container.queryByText('Task Status')).toBeNull()
        expect(submitBtn.textContent).toContain('common:form_actions.create_task')
        expect(cancelBtn.textContent).toContain('common:form_actions.cancel')
        expect(cancelBtn).not.toBeDisabled()
        expect(submitBtn).not.toBeDisabled()
    })
})
