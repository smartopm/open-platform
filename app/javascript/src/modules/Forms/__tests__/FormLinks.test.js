/* eslint-disable security/detect-non-literal-fs-filename */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormLinks from '../components/FormLinks';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';

describe('Shows the google form links', () => {
  it('should render with no errors', () => {
    const container = render(
      <Context.Provider values={userMock}>
        <FormLinks community="Nkwashi" />
      </Context.Provider>
    );

    expect(container.queryByTestId('forms-crf')).toBeInTheDocument();
    expect(container.queryByTestId('forms-building-permit')).toBeInTheDocument();
    expect(container.queryByTestId('forms-link-building-permit')).toBeInTheDocument();
  });

  it('should click link and open new tab', () => {
    window.open = jest.fn();
    const container = render(
      <Context.Provider values={userMock}>
        <FormLinks community="Nkwashi" />
      </Context.Provider>
    );
    const buildPermit = container.queryByTestId('forms-link-building-permit');
    const clientForm = container.queryByTestId('forms-link-crf');
    fireEvent.click(buildPermit);
    expect(window.open).toBeCalledWith(
      'https://docs.google.com/forms/d/e/1FAIpQLSe6JmeKp9py650r7NQHFrNe--5vKhsXa9bFF9kmLAjbjYC_ag/viewform',
      '_blank'
    );
    fireEvent.click(clientForm);
    expect(window.open).toBeCalledWith(
      'https://docs.google.com/forms/d/e/1FAIpQLSe6JmeKp9py650r7NQHFrNe--5vKhsXa9bFF9kmLAjbjYC_ag/viewform',
      '_blank'
    );
  });
});
