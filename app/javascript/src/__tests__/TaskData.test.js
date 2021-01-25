import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import renderTaskData, { LinkToUser } from '../components/Notes/RenderTaskData';

describe('Task Data components ', () => {
  it('should render proper the link to user component', () => {
    const container = render(
      <BrowserRouter>
        <LinkToUser userId="sdfsdf" name="Joe doe" />
      </BrowserRouter>
    );
    expect(container.queryByText('Joe doe')).toBeInTheDocument();
  });

  it('should check if renderTaskData has correct property names', () => {
    const mock = jest.fn();
    const tasks = [
      {
        body: 'Task example',
        id: '23',
        createdAt: new Date('2020-08-01'),
        author: {
          name: 'Johnsc'
        },
        user: {
          name: 'somebody'
        },
        assignees: [{ name: 'Tester', id: '93sd45435' }],
        assigneeNotes: []
      }
    ];
    const results = renderTaskData(tasks, mock, [], mock);
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Select');
    expect(results[0]).toHaveProperty('Task');
    expect(results[0]).toHaveProperty('Created By');
    expect(results[0]).toHaveProperty('Duedate');
    expect(results[0]).toHaveProperty('Assignees');
    expect(results[0]).toHaveProperty('Menu');
  });
});
