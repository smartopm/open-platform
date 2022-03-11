import React from 'react';
import { render, fireEvent, screen, } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import ProjectSteps from '../Components/Steps';
import taskMock from '../../__mocks__/taskMock'

describe('Project Steps', () => {
  const data = [{ ...taskMock }]

  it('should render StepItem', () => {
    const handleStepCompletion = jest.fn()
    const container = render(
      <BrowserRouter>
        <ProjectSteps
          data={data}
          clickable
          setSelectedStep={jest.fn()}
          handleProjectStepClick={jest.fn()}
          handleStepCompletion={handleStepCompletion}
        />
      </BrowserRouter>
    );
    
    expect(container.queryByTestId('process-check-box')).toBeInTheDocument();
    expect(container.queryByTestId('step_body')).toBeInTheDocument();
    expect(container.queryByTestId('show_step_sub_steps')).toBeInTheDocument();
    expect(container.queryByTestId('custom_progress_bar')).toBeInTheDocument();
    expect(container.queryByTestId('custom_progress_bar_text')).toBeInTheDocument();
    
    
    fireEvent.click(container.queryByTestId('process-check-box'));
    expect(handleStepCompletion).toHaveBeenCalled();
  });

  it('should toggle 1st Level Sub Steps in order', () => {
    const stepsWithSubSteps = [{
      ...taskMock,
      subTasksCount: 3,
      subTasks: [
        { body: 'Sub Step 1', order: 1 },
        { body: 'Sub Step 2', order: 2 },
        { body: 'Sub Step 3', order: 3 },
      ],
    }]

    const handleStepCompletion = jest.fn()
    const container = render(
      <BrowserRouter>
        <ProjectSteps
          data={stepsWithSubSteps}
          clickable
          setSelectedStep={jest.fn()}
          handleProjectStepClick={jest.fn()}
          handleStepCompletion={handleStepCompletion}
        />
      </BrowserRouter>
    );
    
    expect(container.queryByTestId('process-check-box')).toBeInTheDocument();
    expect(container.queryByTestId('step_body')).toBeInTheDocument();
    expect(container.queryByTestId('show_step_sub_steps')).toBeInTheDocument();
    expect(container.queryByTestId('custom_progress_bar')).toBeInTheDocument();
    expect(container.queryByTestId('custom_progress_bar_text')).toBeInTheDocument();
    expect(container.queryByTestId('KeyboardArrowDownIcon')).toBeInTheDocument();
    
    fireEvent.click(container.queryByTestId('show-step-sub-steps-click-btn'));

    expect(container.queryByTestId('KeyboardArrowUpIcon')).toBeInTheDocument();
    expect(screen.queryAllByTestId('step_body')[0].textContent).toEqual(taskMock.body)
    expect(screen.queryAllByTestId('step_body')[1].textContent).toEqual('Sub Step 1')
    expect(screen.queryAllByTestId('step_body')[2].textContent).toEqual('Sub Step 2')
    expect(screen.queryAllByTestId('step_body')[3].textContent).toEqual('Sub Step 3')
  });

  it('should render No Steps', () => {
    const handleStepCompletion = jest.fn()
    const container = render(
      <BrowserRouter>
        <ProjectSteps
          data={[]}
          clickable
          setSelectedStep={jest.fn()}
          handleProjectStepClick={jest.fn()}
          handleStepCompletion={handleStepCompletion}
        />
      </BrowserRouter>
    );
    
    expect(container.queryByTestId('no-steps')).toBeInTheDocument();
  });
});
