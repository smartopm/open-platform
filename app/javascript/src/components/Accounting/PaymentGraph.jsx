import React from 'react'
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import Typography from '@material-ui/core/Typography';


export default function PaymentGraph() {
  const data = [
    {
      'no of days': '0-10',
      'cash': 40,
      mobile_money: 72,
      'bank_transfer/cash_deposit': 83,
      'bank_transfer/eft': 92,
      pos: 79
    },
    {
      'no of days': '11-20',
      'cash': 87,
      mobile_money: 83,
      'bank_transfer/cash_deposit': 163,
      'bank_transfer/eft': 80,
      pos: 74
    },
    {
      'no of days': '21-30',
      'cash': 95,
      mobile_money: 95,
      'bank_transfer/cash_deposit': 50,
      'bank_transfer/eft': 48,
      pos: 66
    },
    {
      'no of days': '31-40',
      'cash': 86,
      mobile_money: 96,
      'bank_transfer/cash_deposit': 10,
      'bank_transfer/eft': 12,
      pos: 35
    },
    {
      'no of days': '41-50',
      'cash': 57,
      mobile_money: 20,
      'bank_transfer/cash_deposit': 60,
      'bank_transfer/eft': 20,
      pos: 69
    },
    {
      'no of days': '51-60',
      'cash': 75,
      mobile_money: 29,
      'bank_transfer/cash_deposit': 10,
      'bank_transfer/eft': 20,
      pos: 30
    },
    {
      'no of days': '61-70',
      'cash': 59,
      mobile_money: 36,
      'bank_transfer/cash_deposit': 47,
      'bank_transfer/eft': 10,
      pos: 49
    },
    {
      'no of days': '71-80',
      'cash': 48,
      mobile_money: 59,
      'bank_transfer/cash_deposit': 20,
      'bank_transfer/eft': 50,
      pos: 66
    },
    {
      'no of days': '81-90',
      'cash': 60,
      mobile_money: 33,
      'bank_transfer/cash_deposit': 22,
      'bank_transfer/eft': 44,
      pos: 77
    }
  ];
  return (
    <div style={{width: '80%', margin: '30px 150px', border: '1px solid #E7E7E7'}}>
      <div style={{background: '#FAFEFE', borderBottom: '1px solid #C3DCD8', padding: '25px'}}>
        <Typography variant='body1' color='primary'>Payment Dashboard</Typography>
      </div>
      <div style={{padding: '30px', background: '#FFF'}}>
        <LineChart
          width={1000}
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
          <Line type="monotone" dataKey="cash" stroke="#8884d8" />
          <Line type="monotone" dataKey="mobile_money" stroke="#82ca9d" />
          <Line type="monotone" dataKey="bank_transfer/cash_deposit" stroke="#82ca9d" />
          <Line type="monotone" dataKey="bank_transfer/eft" stroke="#82ca9d" />
          <Line type="monotone" dataKey="pos" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  )
}
