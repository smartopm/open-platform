import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import TaskUpadateForm from '../components/Notes/TaskUpdateForm'

describe('task form component', () => {
    it('should render and have editable fields', () => {
        const data = {
          id: '6v2y3etyu2g3eu2',
          user: {
            name: "tolulope",
            imageUrl: "http://image.com"
          },
          assignees: ["tolulope", "another_user"]
        }
        const container = render(<MockedProvider><TaskUpadateForm data={data} /></MockedProvider>)
        expect(container.queryByText('Update Task')).toBeInTheDocument()
        
        const description = container.queryByLabelText('task_description')
        const submitBtn = container.queryByLabelText('task_submit')
        const previewBtn = container.queryByLabelText('preview')
        const editBtn = container.queryByLabelText('edit')

        fireEvent.change(description, { target: { value: 'This is a description of the task' } })
        expect(description.value).toBe('This is a description of the task')

        expect(container.queryByText('Task Status')).toBeInTheDocument()
        expect(container.queryByText('tolulope')).toBeInTheDocument()
        expect(container.queryAllByTestId('user_chip').length).toBe(3)
        expect(container.queryByText('Task Body')).toBeInTheDocument() // for the toggler
        expect(submitBtn.textContent).toContain('Update Task')
        expect(previewBtn).not.toBeNull()
        expect(editBtn).not.toBeNull()
        expect(submitBtn).not.toBeDisabled()
    })
})