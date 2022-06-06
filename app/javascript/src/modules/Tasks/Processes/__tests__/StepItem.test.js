import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import StepItem from '../Components/StepItem';
import taskMock from '../../__mocks__/taskMock';

const mockAuthState = {
  ...authState,
  user: {
    ...authState.user,
    community: {
      ...authState.user.community,
      name: 'Tilisi'
    }
  }
};

describe('StepItem', () => {
  const step = { ...taskMock }

  it('should render StepItem', () => {
    const container = render(
      <Context.Provider value={mockAuthState}>
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
      </Context.Provider>
    );

    expect(container.queryByTestId('process-check-box')).toBeInTheDocument();
    expect(container.queryByTestId('step_body')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('process-check-box'));
    expect(container.queryByTestId('step_body_section')).toBeInTheDocument();
  });
});
