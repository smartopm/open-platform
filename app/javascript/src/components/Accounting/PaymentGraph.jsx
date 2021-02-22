import React, { useState } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { PaymentStats, PaymentStatsDetails } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../CenteredContent';
import { formatError } from '../../utils/helpers';
import PaymentStatDetails from './PaymentStatDetails'
import GraphTitle from './GraphTitle'


export default function PaymentGraph({ currency }){
  const stroke = {
    "#8884d8": 'cash',
    "#82ca9d": 'mobile_money',
    "#E79040": 'bank_transfer/cash_deposit',
    "#3493FB": 'bank_transfer/eft',
    "#E74540": 'pos'
  }
  const [query, setQuery] = useState(null)
  const [type, setType] = useState(null)
  const { loading, data, error } = useQuery(PaymentStats, {
    fetchPolicy: 'cache-and-network'
  });

  const [loadPaymentDetail, {  error: statError, data: statData } ] = useLazyQuery(PaymentStatsDetails,{
    variables: { query, type },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  function handleClick(e){
    setType(stroke[e.stroke])
    setQuery(e.points[0].payload.noOfDays)
    loadPaymentDetail()
  }
  if (loading) return <Spinner />
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  if (statError) {
    return <CenteredContent>{formatError(statError.message)}</CenteredContent>;
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
                  <Line cursor="pointer" type="monotone" dataKey="cash" stroke="#8884d8" onClick={handleClick} />
                  <Line cursor="pointer" type="monotone" dataKey="mobileMoney" stroke="#82ca9d" onClick={handleClick} />
                  <Line cursor="pointer" type="monotone" dataKey="bankTransfer" stroke="#E79040" onClick={handleClick} />
                  <Line cursor="pointer" type="monotone" dataKey="eft" stroke="#3493FB" onClick={handleClick} />
                  <Line cursor="pointer" type="monotone" dataKey="pos" stroke="#E74540" onClick={handleClick} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
      ) : (
        <CenteredContent>No data available</CenteredContent>
      ) }
      </div>
      {statData && (
        <PaymentStatDetails data={statData.paymentStatDetails} currency={currency} />
      )}
    </>
  )
}

PaymentGraph.propTypes = {
  currency: PropTypes.string.isRequired
}
