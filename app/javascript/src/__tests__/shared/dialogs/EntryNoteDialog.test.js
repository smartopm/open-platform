import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import EntryNoteDialog from '../../../shared/dialogs/EntryNoteDialog'

describe('It should render the entry note dialog', () => {
    it('should render with dialog', () => {
        const mock = jest.fn()
        const imageUrls = [
          'dummy_link.jpg'
        ]
      const container = render(
        <EntryNoteDialog
          open
          observationHandler={{
              value: "Some default value",
              handleChange: mock
          }}
          handleDialogStatus={jest.fn()}
          imageOnchange={jest.fn()}
          token='thyhubiuwe'
          imageUrls={imageUrls}
          status='INIT'
        >
          <p>
            Some text child of entry note
          </p>
        </EntryNoteDialog>
      )
      expect(container.queryByTestId('entry-dialog')).toBeInTheDocument()
      expect(container.queryByText('observations.observation_title')).toBeInTheDocument()
      expect(container.queryAllByText('observations.add_your_observation')[0]).toBeInTheDocument()
      expect(container.queryAllByTestId('entry-dialog-field')[0]).toBeInTheDocument()
      expect(container.queryByText('Some text child of entry note')).toBeInTheDocument()
      expect(container.queryByTestId('upload_label')).toBeInTheDocument()
      expect(container.queryAllByTestId('upload_button')[0]).toBeInTheDocument()
    });
});
