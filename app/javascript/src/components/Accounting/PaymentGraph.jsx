import React from 'react'
import { useQuery } from 'react-apollo';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import Typography from '@material-ui/core/Typography';
import { PaymentStats } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../CenteredContent';
import { formatError } from '../../utils/helpers';
import GraphTitle from './GraphTitle'


export default function PaymentGraph(){
  const { loading, data, error } = useQuery(PaymentStats, {
    fetchPolicy: 'cache-and-network'
  });

  if (loading) return <Spinner />
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <>
      <div style={{width: '80%', margin: '30px 150px', border: '1px solid #E7E7E7'}}>
        {data?.paymentAccountingStats && data?.paymentAccountingStats?.length ? (
          <div>
            <div style={{background: '#FAFEFE', borderBottom: '1px solid #C3DCD8', padding: '25px'}}>
              <Typography variant='body1' color='primary'>Payment Dashboard</Typography>
            </div>
            <GraphTitle title='Total Amount Paid/Number of days' />
            <div style={{padding: '30px', background: '#FFF'}}>
              <ResponsiveContainer width="100%" height={500}>
                <LineChart
                  width={1000}
                  height={400}
                  data={data.paymentAccountingStats}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="noOfDays" />
                  <YAxis />
                  <Legend />
                  <Line type="monotone" dataKey="cash" stroke="#8884d8" />
                  <Line type="monotone" dataKey="mobileMoney" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="bankTransfer" stroke="#E79040" />
                  <Line type="monotone" dataKey="eft" stroke="#3493FB" />
                  <Line type="monotone" dataKey="pos" stroke="#E74540" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
      ) : (
        <CenteredContent>No data available</CenteredContent>
      ) }
      </div>
    </>
  )
}
