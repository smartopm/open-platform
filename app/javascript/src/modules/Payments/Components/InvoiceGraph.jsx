import React from 'react'
import { useQuery } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { InvoicesStats } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import { formatError } from '../../../utils/helpers';

export default function InvoiceGraph({ handleClick }){
  const { loading, data, error } = useQuery(InvoicesStats, {
    fetchPolicy: 'cache-and-network'
  });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  if (loading) return <Spinner />
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <>
      <div style={matches ? {width: '80%', margin: '30px 150px', border: '1px solid #E7E7E7'} : {width: '100%', margin: '10px 0', border: '1px solid #E7E7E7'}}>
        {data?.invoiceAccountingStats && data?.invoiceAccountingStats?.length && (
          <div>
            <div style={{background: '#FAFEFE', borderBottom: '1px solid #C3DCD8', padding: '25px'}}>
              <Typography variant='body1' color='primary'>Number of Outstanding Invoices by Number of days</Typography>
            </div>
            <div style={{padding: '30px', background: '#FFF'}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={600}
                  height={200}
                  data={data.invoiceAccountingStats}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="noOfDays" />
                  <YAxis />
                  <Tooltip />
                  <Bar cursor="pointer" dataKey="noOfInvoices" fill="#66A79B" onClick={handleClick} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

InvoiceGraph.propTypes = {
  handleClick: PropTypes.func.isRequired
};