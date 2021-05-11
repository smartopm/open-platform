import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { dateToString } from '../../../components/DateContainer';
import UserPlotMap from './UserPlotMap';

export default function UserPlotInfo({ account }) {
  const [plotNumber, setPlotNumber] = useState([]);
  const { t } = useTranslation('users')

  function setData() {
    if (account[0]?.landParcels[0]) {
      account[0].landParcels.forEach(plot => {
        setPlotNumber(...plotNumber, ...plot.parcelNumber);
      });
    }
  }

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  function parcels() {
    if (account) {
      const landParcels = account
        .map(acc => {
          return acc.landParcels.map(plot => plot);
        })
      return [].concat(...landParcels);
    }
    return [];
  }

  return (
    <>
      {parcels().length > 0 ? (
        <div className="container">
          <div className={css(styles.body)}>
            <div>
              <div style={{ display: 'flex' }}>
                <Typography variant="body1">
                  <b>Plots associated with this account:</b>
                </Typography>
              </div>
              {parcels().map((plot, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div style={{ display: 'flex' }} key={index}>
                  <li className={css(styles.plotNumber)}>{plot.parcelNumber}</li>
                </div>
              ))}
              <Typography variant="body2">
                {`This data was updated on ${dateToString(
                  parcels()[parcels().length - 1]?.updatedAt
                )}. If Something seems incorrect, contact our`}
                <span className={css(styles.supportLink)}>
                  &nbsp;
                  <Link data-testid="support_link" to="/contact" className={css(styles.routeLink)}>
                    Support Team.
                  </Link>
                </span>
              </Typography>
            </div>
            <div className={css(styles.mapContainer)}>
              <UserPlotMap plotData={account} />
            </div>
          </div>
        </div>
      ) : (
        <div className="container" style={{ display: 'flex', margin: '20px 150px' }}>
          <p data-testid="no_plot">{t("common:misc.no_plot")}</p>
        </div>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  supportLink: {
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  plotNumber: {
    listStyle: 'none',
    background: '#fafefe',
    padding: '10px',
    width: '30%',
    margin: '10px',
    textAlign: 'center',
    border: '2px solid #69aba4',
    color: '#69aba4'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  routeLink: {
    textDecoration: 'underline',
    color: 'black'
  },
  chatButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF',
    width: '100%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50
  },
  mapContainer: {
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '100%'
  }
});

UserPlotInfo.defaultProps = {
  account: []
};

UserPlotInfo.propTypes = {
  account: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      landParcels: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          plotNumber: PropTypes.string
        })
      ),
      updatedAt: PropTypes.string
    })
  )
};
