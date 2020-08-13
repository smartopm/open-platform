import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import CampaignLabels from '../components/CampaignLabels'
import { LabelsQuery } from '../graphql/queries'


describe('It should test the create label component', () => {

    const mockData = {
        request: {
            query: LabelsQuery,
        },
        result: {
            data: {
                labels: [
                    {
                        id: '12345678890',
                        shortDesc: "Client"
                    }
                ]
            }
        }
    }

    const props = {
        handleLabelSelect: jest.fn()
    }
    
    it('it should render with no error', () => {

        const container = render(
            <MockedProvider mock={mockData} addTypename={false}>
                <CampaignLabels {...props} />
            </MockedProvider>
        )
        
        expect(container.queryByTestId("campaignLabel-creator")).toBeDefined();
    });
    
});