import React from 'react'
import Typography from '@material-ui/core/Typography';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function InvoiceGraph(){

  const data = [
    {
      'no of days': '0-10',
      'no of invoices': 40,
    },
    {
      'no of days': '11-20',
      'no of invoices': 20,
    },
    {
      'no of days': '21-30',
      'no of invoices': 60,
    },
    {
      'no of days': '31-40',
      'no of invoices': 90,
    }
  ];
  return (
    <div style={{width: '80%', margin: '30px 150px', border: '1px solid #E7E7E7'}}>
      <div style={{background: '#FAFEFE', borderBottom: '1px solid #C3DCD8', padding: '25px'}}>
        <Typography variant='body1' color='primary'>Invoicing Dashboard</Typography>
      </div>
      <div style={{padding: '30px', background: '#FFF'}}>
        <BarChart
          width={900}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="no of days" />
          <YAxis />
          <Bar dataKey="no of invoices" fill="#66A79B" />
        </BarChart>
      </div>
    </div>
  )
}