import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import NoteListItem from '../NoteListItem';

describe('NoteListItem component', () => {
  it('should properly render NoteListItem component', () => {
    const handler = jest.fn()
    const noteData = {
        body: 'some body',
        createdAt: '2020-10-09'
    }

    const wrapper = render(
      <NoteListItem hasActions note={noteData} handleOpenMenu={handler}  />
    );
    expect(wrapper.queryByTestId('note_body')).toBeInTheDocument();
    expect(wrapper.queryByTestId('note_body').textContent).toContain('some body');
    expect(wrapper.queryByTestId('note_created_at')).toBeInTheDocument();
    expect(wrapper.queryByTestId('note_created_at').textContent).toContain('2020-10-09');
    expect(wrapper.queryByTestId('more_details')).toBeInTheDocument();

    fireEvent.click(wrapper.queryByTestId('more_details'))
    expect(handler).toBeCalled()
  });
});
