import React, { useState } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts';
import { InvoicesStats, InvoicesStatsDetails } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../CenteredContent';
import { formatError } from '../../utils/helpers';
import InvoiceStatDetails from './InvoiceStatDetails'
import GraphTitle from './GraphTitle'

export default function InvoiceGraph({currency }){
  const [query, setQuery] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const { loading, data, error } = useQuery(InvoicesStats, {
    fetchPolicy: 'cache-and-network'
  });

  function invoiceBarOnclick(e, index){
    setQuery(e.noOfDays)
    loadInvoiceDetail()
    setActiveIndex(index)
  }

  const [loadInvoiceDetail, {  error: statError, data: invoicesStatData } ] = useLazyQuery(InvoicesStatsDetails,{
    variables: { query },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

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
        {data?.invoiceAccountingStats && data?.invoiceAccountingStats?.length ? (
          <div>
            <div style={{background: '#FAFEFE', borderBottom: '1px solid #C3DCD8', padding: '25px'}}>
              <Typography variant='body1' color='primary'>Invoicing Dashboard</Typography>
            </div>
            <GraphTitle title='Number of Invoices/Number of days' />
            <div style={{padding: '30px', background: '#FFF'}}>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  width={600}
                  height={400}
                  data={data.invoiceAccountingStats}
                  margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
                >
                  <XAxis dataKey="noOfDays" />
                  <YAxis />
                  <Bar dataKey="noOfInvoices" fill="#66A79B" onClick={invoiceBarOnclick}>
                    {data.invoiceAccountingStats.map((inv, index) => (
                      <Cell cursor="pointer" fill={index === activeIndex ? '#82ca9d' : '#66A79B'} key={`cell-${inv.id}`} />
              ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <CenteredContent>No data available</CenteredContent>
        )}
      </div>
      {invoicesStatData && (
        <InvoiceStatDetails data={invoicesStatData.invoicesStatDetails} currency={currency} />
      )}
    </>
  )
}

InvoiceGraph.propTypes = {
  currency: PropTypes.string.isRequired
}