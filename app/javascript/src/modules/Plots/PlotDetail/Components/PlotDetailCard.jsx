/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { PaymentPlan } from '../graphql/plot_detail_query'
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../utils/dateutil';
import CenteredContent from '../../../../components/CenteredContent';
import { formatError, formatMoney } from '../../../../utils/helpers';
import EmptyCard from '../../../../shared/EmptyCard'
import { currencies } from '../../../../utils/constants';

export default function PlotDetailCard({ authState }) {
  const matches = useMediaQuery('(max-width:600px)')
  const currency = currencies[authState?.community.currency] || '';
  const currencyData = { currency, locale: authState?.community.locale }
  const { loading, data, error } = useQuery(PaymentPlan, {
    variables: {
      userId: authState.id
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const history = useHistory();
  const classes = useStyles();

  // const spicedInvoiced = data?.paymentPlan.invoices.slice(0, 4)

  function checkDate(date){
    if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
      return true
    }
    return false
  }

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <div>
      {loading ? <Spinner /> : (
        <div>
          <Typography style={matches ? {margin: '20px 0 26px 20px', fontWeight: 'bold'} : {margin: '40px 0 20px 79px', fontWeight: 500, fontSize: '22px', color: '#141414'}}>Plot Details</Typography>
          <div>
            {data?.paymentPlan.length > 0 ? (
              <div className={classes.root} style={matches ? {marginLeft: '20px'} : {marginLeft: '79px'}}>
                <GridList className={classes.gridList} cols={matches ? 1 : 3.5}>
                  {data.paymentPlan.map((tile) => (
                    <GridListTile key={tile.id}>
                      <div className={classes.gridTile} onClick={() => history.push(`/tasks/${tile.id}`)}>
                        <div>
                          <Typography className={classes.plot}>
                            Plot
                            {' '}
                            {tile.landParcel.parcelNumber}
                          </Typography>
                          {tile.invoices.slice(0, 3).map((inv) => (
                            <Typography className={classes.invoice} key={inv.id} style={checkDate(tile.dueDate) ? {color: 'red'} : null}>
                              Invoice 
                              {' '}
                              {inv.invoiceNumber}
                              {' '}
                              due 
                              {' '}
                              {dateToString(inv.dueDate)}
                            </Typography>
                          ))}
                        </div>
                        <div>
                          <Typography className={classes.balance}>{formatMoney(currencyData, tile.plotBalance)}</Typography>
                          <Typography className={classes.balanceText}>Balance</Typography>
                        </div>
                      </div>
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            ) : (
              <EmptyCard title='No Plot Available' subtitle='Your plots will appear here' />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    marginBottom: '40px'
  },
  gridList: {
    flexWrap: 'nowrap',
    width: '100%'
  },
  gridTile: {
    display: 'flex',
    border: '1px solid #EBEBEB',
    padding: '20px',
    backgroundColor: theme.palette.background.paper,
    height: '178px',
    width: '304px',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '8px'
  },
  date: {
    display: 'flex', 
    marginBottom: '-8px'
  },
  plot: {
    fontWeight: 700,
    fontSize: '18px',
    color: '#141414',
    marginBottom: '12px'
  },
  invoice: {
    marginBottom: '7px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: 1.375,
    color: '#141414'
  },
  balance: {
    fontWeight: 600,
    fontSize: '24px',
    color: '#141414',
    marginBottom: '3.5px'
  },
  balanceText: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 1.375,
    color: '#838383'
  }
}));
