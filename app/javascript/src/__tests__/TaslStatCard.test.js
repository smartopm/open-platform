import React from 'react' 
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import TaskStatCard from '../components/Notes/TaskStatCard'

describe('Task card to display metrics', () => {

    const props = {
        count: 3, 
        title: "Tasks with no due date",
        filterTasks: jest.fn()
    }


    it('It should render the component with no errors', () => {

        const container = render(
            <TaskStatCard {...props} />
        )
        expect(container.queryByTestId("task-stat-card")).toBeInTheDocument()
        
    });

    it('It should render the component with content', () => {

        const container = render(
            <TaskStatCard {...props} />
        )
        expect(container.queryByTestId("task-stat-title")).toBeInTheDocument()
        expect(container.queryByTestId("task-stat-count")).toBeInTheDocument()
        
        
    })
    
    
});
