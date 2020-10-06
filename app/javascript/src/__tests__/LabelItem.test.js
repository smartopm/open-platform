import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LabelItem from '../components/Label/LabelItem'

describe('Label Item Component', () => {
  it('it should include the label details ', () => {
      const props = {
        label: {
            "id": "2b3f902b-eb44",
            "shortDesc": "com_news_sms"
        },
        userType: 'admin', 
        userCount: 10
      }
    const container = render(<LabelItem {...props} />)
    expect(container.queryByText('com_news_sms')).toBeInTheDocument()
    expect(container.queryByText('10')).toBeInTheDocument()
    expect(container.queryByTestId('label-title')).toHaveTextContent('com_news_sms')
    expect(container).toMatchSnapshot()
  })
})
