import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { EmailTemplatesQuery } from '../../graphql/queries'
import TemplateList from '../../components/EmailTemplate/TemplateList'
import { Spinner } from '../../components/Loading'

describe('Template List Component', () => {
    it('should return a list of all email templates', async () => {
        const templateMock = {
            request: {
              query: EmailTemplatesQuery,
            },
            result: {
                data: {
                    emailTemplates: [
                        {
                            "name": "task update",
                            "id": "501b718c-8687-4e78-60b732df5ab1"
                          },
                    ]
                }
            }
        }
        const container = render(
          <MockedProvider mocks={[templateMock]}>
            <TemplateList 
              value={templateMock.result.data.emailTemplates[0].id} 
              handleValue={jest.fn()}
              createTemplate={() => {}}
              shouldRefecth
              isRequired
            />
          </MockedProvider>
        )
        const loader = render(<Spinner />)

        expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

        await waitFor(() => {
            expect(container.queryByText('Select a template')).toBeInTheDocument()
            expect(container.queryByTestId('template_list')).toBeInTheDocument()
        }, 100)
    
    })
})