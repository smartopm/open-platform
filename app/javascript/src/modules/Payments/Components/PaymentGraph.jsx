import React from 'react'
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import { PaymentStats } from '../../../graphql/queries';
import CenteredContent from '../../../components/CenteredContent';
import { formatError } from '../../../utils/helpers';


export default function PaymentGraph({ handleClick }){
  const { t } = useTranslation(['payment', 'common']);
  const { data, error } = useQuery(PaymentStats, {
    fetchPolicy: 'cache-and-network'
  });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <>
      <div style={matches ? {width: '80%', margin: '30px 150px', border: `1px solid ${theme.palette.primary.light}` } : {width: '100%', margin: '10px 0', border: `1px solid ${theme.palette.primary.light}` }}>
        {data?.paymentAccountingStats && data?.paymentAccountingStats?.length && (
          <div>
            <div style={{borderBottom: `1px solid ${theme.palette.primary.main}`, padding: '25px'}}>
              <Typography variant='body1' color='primary'>{t('misc.total_amount_paid')}</Typography>
            </div>
            <div style={{padding: '30px'}}>
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
                  <Bar cursor="pointer" stackId="a" dataKey="cash" fill={theme.palette.primary.main} onClick={handleClick} />
                  <Bar cursor="pointer" stackId="a" dataKey="mobileMoney" fill={theme.palette.success.main} onClick={handleClick} />
                  <Bar cursor="pointer" stackId="a" dataKey="bankTransfer" fill={theme.palette.info.main} onClick={handleClick} />
                  <Bar cursor="pointer" stackId="a" dataKey="eft" fill={theme.palette.secondary.main} onClick={handleClick} />
                  <Bar cursor="pointer" stackId="a" dataKey="pos" fill={theme.palette.warning.light} onClick={handleClick} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
      )}
      </div>
    </>
  )
}

PaymentGraph.propTypes = {
  handleClick: PropTypes.func.isRequired
};
