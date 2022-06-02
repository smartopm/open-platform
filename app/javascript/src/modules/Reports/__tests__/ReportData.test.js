import React from 'react';
import { render } from '@testing-library/react';

import ReportData from '../components/ReportData';

describe('Report Component', () => {
  it('should mount component correctly', () => {
    const dataMock = {
        "Last Name": [
          {
            createdAt: new Date("2021-07-19T10:33:58+02:00"),
            id: "abaea7ab-de4b-4d5e-9187-e465016a666a",
            value: "XJ is my name",
            fieldType: "text"
          },
          {
            createdAt: new Date("2021-07-19T10:33:58+02:00"),
            id: "abaea7ab-de4b-4d5e-9187-e465016a666a",
            value: "XJ is my other name",
            fieldType: "text"
          }
        ],
        "Another field": [
          {
            createdAt: new Date("2021-07-19T10:33:58+02:00"),
            id: "4e61b13d-c1e5-421f-9f75-c6fd6016fecf",
            value: "1",
            fieldType: "file_upload"
          }
        ]
      };

    const container = render(<ReportData formattedData={dataMock} />);
    expect(container.queryByText('Another field')).toBeInTheDocument()
    expect(container.queryByText('Last Name')).toBeInTheDocument()
    expect(container.queryByText('XJ is my name')).toBeInTheDocument()
    expect(container.queryByText('XJ is my other name')).toBeInTheDocument()
    expect(container.queryByTestId('extra_horas').textContent).toContain('report:misc.extra_hours : 0')
  });
});
