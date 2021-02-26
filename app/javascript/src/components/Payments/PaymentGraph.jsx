import React from 'react'
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Typography from '@material-ui/core/Typography';
import { PaymentStats } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../CenteredContent';
import { formatError } from '../../utils/helpers';
import GraphTitle from './GraphTitle'


export default function PaymentGraph({ handleClick }){
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
            <GraphTitle title='Total Amount Paid/Date' />
            <div style={{padding: '30px', background: '#FFF'}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="trxDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar cursor="pointer" stackId="a" dataKey="cash" fill="#8884d8" onClick={handleClick} />
                  <Bar cursor="pointer" stackId="a" dataKey="mobileMoney" fill="#82ca9d" onClick={handleClick} />
                  <Bar cursor="pointer" stackId="a" dataKey="bankTransfer" fill="#E79040" onClick={handleClick} />
                  <Bar cursor="pointer" stackId="a" dataKey="eft" fill="#3493FB" onClick={handleClick} />
                  <Bar cursor="pointer" stackId="a" dataKey="pos" fill="#744db8" onClick={handleClick} />
                </BarChart>
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

PaymentGraph.propTypes = {
  handleClick: PropTypes.func.isRequired
};
