import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import routeData, { MemoryRouter } from 'react-router';
import HorizontalStepper from '../../shared/HorizontalStepper';

describe('HorizontalStepper component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  const steps = jest.fn(next => [
    {
      title: 'First Step',
      component: <button type="button" onClick={() => next(true)} data-testid="only_step">First Step Contents</button>
    }
  ]);

  const manySteps = jest.fn(next => [
    {
      title: 'First Step',
      component: (
        <button type="button" onClick={next} data-testid="first_step">
          First Step Contents
        </button>
      )
    },
    {
      title: 'Other Step',
      component: <p>Other Step Contents</p>
    }
  ]);
  it('should not show step buttons when its just one step', () => {
    const container = render(
      <MemoryRouter>
        <HorizontalStepper
          steps={steps}
          communityName="Nkwashi"
        />
      </MemoryRouter>
    );
    expect(container.queryByTestId('stepper_container')).toBeInTheDocument();
    expect(container.queryByTestId('step_button')).not.toBeInTheDocument();
    expect(container.queryByText('First Step Contents')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('only_step'));
    expect(container.queryByText('First Step Contents')).toBeInTheDocument();
    expect(mockHistory.push).toBeCalled()
  });

  it('should show all steps correctly', () => {
    const container = render(
      <MemoryRouter>
        <HorizontalStepper
          steps={manySteps}
          communityName="CM"
        />
      </MemoryRouter>
    );
    expect(container.queryAllByTestId('step_button')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('step_button')).toHaveLength(2);
    expect(container.queryByText('First Step Contents')).toBeInTheDocument();
    expect(container.queryByText('Other Step Contents')).not.toBeInTheDocument();
    // click to move to next step
    fireEvent.click(container.queryByTestId('first_step'));
    expect(container.queryByText('Other Step Contents')).toBeInTheDocument();
    // clicking the step should take you to that step's content
    fireEvent.click(container.queryAllByTestId('step_button')[0]);
    expect(container.queryByText('First Step Contents')).toBeInTheDocument();
  });
});
