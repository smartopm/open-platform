import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
          handleStepCompletion={handleStepCompletion}
        />
      </BrowserRouter>
    );
    
    expect(container.queryByTestId('step_completion_toggle_button')).toBeInTheDocument();
    expect(container.queryByTestId('step_body')).toBeInTheDocument();
    expect(container.queryByTestId('show_step_sub_steps')).toBeInTheDocument();


    fireEvent.click(container.queryByTestId('step_completion_toggle_button'));
    expect(handleStepCompletion).toHaveBeenCalled();
  });

  it('should render No Steps', () => {
    const handleStepCompletion = jest.fn()
    const container = render(
      <BrowserRouter>
        <ProjectSteps
          data={[]}
          clickable
          setSelectedStep={jest.fn()}
          handleStepCompletion={handleStepCompletion}
        />
      </BrowserRouter>
    );
    
    expect(container.queryByTestId('no-steps')).toBeInTheDocument();
  });
});
