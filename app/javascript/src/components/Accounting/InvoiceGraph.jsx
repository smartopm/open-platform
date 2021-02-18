import React from 'react'
import { useQuery } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { InvoicesStats } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../CenteredContent';
import { formatError } from '../../utils/helpers';

export default function InvoiceGraph(){
  const { loading, data, error } = useQuery(InvoicesStats, {
    fetchPolicy: 'cache-and-network'
  });
  if (loading) return <Spinner />
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <div style={{width: '80%', margin: '30px 150px', border: '1px solid #E7E7E7'}}>
      <div style={{background: '#FAFEFE', borderBottom: '1px solid #C3DCD8', padding: '25px'}}>
        <Typography variant='body1' color='primary'>Invoicing Dashboard</Typography>
      </div>
      <div style={{padding: '30px', background: '#FFF'}}>
        <BarChart
          width={900}
          height={400}
          data={data?.invoiceAccountingStats}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="noOfDays" />
          <YAxis />
          <Bar dataKey="noOfInvoices" fill="#66A79B" />
        </BarChart>
      </div>
    </div>
  )
}