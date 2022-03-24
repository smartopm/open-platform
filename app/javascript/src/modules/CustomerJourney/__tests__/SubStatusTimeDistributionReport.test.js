import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SubStatusTimeDistributionReport from '../Components/SubStatusTimeDistributionReport'
import { userSubStatus } from '../../../utils/constants';

describe('<SubStatusTimeDistributionReport />', () => {
  it('render correctly', () => {
    const subStatusDistributionData = {
        substatusDistributionQuery: { 
          eligibleToStartConstruction: {
            between0to10Days: 0,
            between11to30Days: 0,
            between31to50Days: 0,
            between51to150Days: 0,
            over151Days: 0,
          },
          buildingPermitApproved: {
            between0to10Days: 0,
            between11to30Days: 0,
            between31to50Days: 0,
            between51to150Days: 0,
            over151Days: 0,
          }, 
          constructionInProgress: {
            between0to10Days: 0,
            between11to30Days: 0,
            between31to50Days: 0,
            between51to150Days: 0,
            over151Days: 0,
          }, 
          constructionCompleted: {
            between0to10Days: 0,
            between11to30Days: 0,
            between31to50Days: 0,
            between51to150Days: 0,
            over151Days: 0,
          }, 
          floorPlanPurchased: {
            between0to10Days: 0,
            between11to30Days: 0,
            between31to50Days: 0,
            between51to150Days: 0,
            over151Days: 0,
          },
          plotsFullyPurchased: {
            between0to10Days: 0,
            between11to30Days: 0,
            between31to50Days: 0,
            between51to150Days: 0,
            over151Days: 0,
          },
          constructionInProgressSelfBuild: {
            between0to10Days: 0,
            between11to30Days: 0,
            between31to50Days: 0,
            between51to150Days: 0,
            over151Days: 0,
          }
      }
    }

    const container = render(
      <SubStatusTimeDistributionReport 
        userSubStatus={userSubStatus} 
        subStatusDistributionData={subStatusDistributionData} 
      />
    )
    
    expect(container.queryByText('Eligible to start Construction')).toBeInTheDocument()
    expect(container.queryAllByText(/0 - 10 days/i).length).toBeGreaterThan(1)
  })
})
