import React from 'react'
import { render } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import StatusBadge from '../components/StatusBadge'

describe('It should test the status badge component', () => {
  it('should render with pending status', () => {
     const container = render(
       <BrowserRouter>
         <MockedProvider>
           <StatusBadge label='pending' />
         </MockedProvider>
       </BrowserRouter>
    )

    expect(container.getByText("pending")).toBeInTheDocument()
  });

  it('should render with expired status', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <StatusBadge label='expired' />
        </MockedProvider>
      </BrowserRouter>
   )

   expect(container.getByText("expired")).toBeInTheDocument()
 });

 it('should render with banned status', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <StatusBadge label='banned' />
        </MockedProvider>
      </BrowserRouter>
   )

   expect(container.getByText("Not Allowed")).toBeInTheDocument()
 });

 it('should render with verified status', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <StatusBadge label='verified' />
        </MockedProvider>
      </BrowserRouter>
   )

   expect(container.getAllByText("verified")[0]).toBeInTheDocument()
 });

 it('should render with not verified status', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <StatusBadge label='notVerified' />
        </MockedProvider>
      </BrowserRouter>
   )

   expect(container.getByText("notVerified")).toBeInTheDocument()
 });

 it('should render with random status', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <StatusBadge label='random' />
        </MockedProvider>
      </BrowserRouter>
   )

   expect(container.getByText("random")).toBeInTheDocument()
 });
});