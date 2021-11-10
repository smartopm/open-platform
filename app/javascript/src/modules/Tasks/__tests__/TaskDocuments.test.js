import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskDocuments from '../Components/TaskDocuments';

describe('Task Documents', () => {
  // props
  const documents = [
    {
      id: '92348129',
      filename: 'picture.png',
      url: 'https://picture.png',
      created_at: "2020-10-01"
    }
  ];
  const emptyDocs = [];
  it('renders properly when there are documents', () => {
    const wrapper = render(<TaskDocuments documents={documents} />);
    expect(wrapper.queryByTestId('documents_title')).toBeInTheDocument()
    expect(wrapper.queryByTestId('documents_title').textContent).toContain('document.documents')
    expect(wrapper.queryByTestId('opening_divider')).toBeInTheDocument()
    expect(wrapper.queryByTestId('filename')).toBeInTheDocument()
    expect(wrapper.queryByTestId('filename').textContent).toContain('picture.png')
    expect(wrapper.queryByTestId('uploaded_at')).toBeInTheDocument()
    expect(wrapper.queryByTestId('uploaded_at').textContent).toContain('2020-10-01')
    expect(wrapper.queryByTestId('more_details')).toBeInTheDocument()
    expect(wrapper.queryByTestId('closing_divider')).toBeInTheDocument()
  });
  it('renders no documents', () => {
    const wrapper = render(<TaskDocuments documents={emptyDocs} />);
    expect(wrapper.queryByTestId('no_documents')).toBeInTheDocument()
    expect(wrapper.queryByTestId('no_documents').textContent).toContain('document.no_documents')
  })
});
