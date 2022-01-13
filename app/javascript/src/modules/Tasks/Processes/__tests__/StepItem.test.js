import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import StepItem from '../Components/StepItem';
import taskMock from '../../__mocks__/taskMock'

describe('StepItem', () => {
  const step = { ...taskMock }

  it('should render StepItem', () => {
    const container = render(
      <BrowserRouter>
        <StepItem
          step={step}
          clickable
          handleClick={jest.fn()}
          openSubSteps
          handleOpenSubStepsClick={jest.fn()}
          handleStepCompletion={jest.fn}
        />
      </BrowserRouter>
    );
    
    expect(container.queryByTestId('process-check-box')).toBeInTheDocument();
    expect(container.queryByTestId('step_body')).toBeInTheDocument();


    fireEvent.click(container.queryByTestId('process-check-box'));
    expect(container.queryByTestId('step_body_section')).toBeInTheDocument();
  });
});
