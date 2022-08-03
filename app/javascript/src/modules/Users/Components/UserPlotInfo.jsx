/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { dateToString } from '../../../components/DateContainer';
import UserPlotMap from './UserPlotMap';
import { objectAccessor } from '../../../utils/helpers';

export default function UserPlotInfo({ account, userId, userName, currentUser }) {
  const [plotNumber, setPlotNumber] = useState([]);
  const { t } = useTranslation(['users', 'common'])
  const classes = useStyles();
  const history = useHistory();

  function setData() {
    if (account[0]?.landParcels[0]) {
      account[0].landParcels.forEach(plot => {
        setPlotNumber(...plotNumber, ...plot.parcelNumber);
      });
    }
  }

  function handlePlotClick(id) {
    history.push({pathname: `/land_parcels`, search: `?plot=${id}`, state: { from: 'users', userId }})
  }

  function handlePlotCreteClick() {
    history.push({pathname: `/land_parcels`, search: `?type=new`, state: { from: 'users', user: { userName, userId }}})
  }

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  function parcels() {
    if (account.length > 0) {
      const landParcels = account
        .map(acc => {
          return acc.landParcels.map(plot => plot);
        })
      return [].concat(...landParcels);
    }
    return [];
  }
  const landParcelPermissions = currentUser?.permissions?.find(permissionObject => permissionObject.module === 'land_parcel')
  const canCreateLandParcel = landParcelPermissions? landParcelPermissions.permissions.includes('can_create_land_parcel'): false

  return (
    <>
      {canCreateLandParcel && (
        <Fab color="primary" variant="extended" className={classes.plot} onClick={() => handlePlotCreteClick()} data-testid='add-plot'>
          {t("common:misc.new_property")}
        </Fab>
      )}
      {parcels().length > 0 ? (
        <div className="container">
          <div className={classes.body}>
            <div>
              <div style={{ display: 'flex' }}>
                <Typography variant="body1">
                  <b>
                    {t("common:misc.plot_message")}
                    :
                  </b>
                </Typography>
              </div>
              {parcels().map((plot, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => handlePlotClick(plot.id)} key={index} data-testid='plot'>
                  <li className={classes.plotNumber}>{plot.parcelNumber}</li>
                </div>
              ))}
              <Typography variant="body2">
                {t('common:misc.plot_details', { date: dateToString(objectAccessor(parcels(), parcels().length - 1)?.updatedAt) })}
                <span className={classes.supportLink}>
                  &nbsp;
                  <Link data-testid="support_link" to="/contact" className={classes.routeLink}>
                    {t("common:misc.support_team")}
                  </Link>
                </span>
              </Typography>
            </div>
            <div className={classes.mapContainer}>
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

const useStyles = makeStyles(theme => ({
  supportLink: {
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  plotNumber: {
    listStyle: 'none',
    background: '#fafefe',
    padding: '10px',
    margin: '10px',
    textAlign: 'center',
    border: `2px solid ${theme.palette.primary.main}`,
    color: 'theme.palette.primary.main'
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
  mapContainer: {
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '100%'
  },
  plot: {
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    zIndex: '1000'
  }
}))

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
  ),
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    permissions: PropTypes.arrayOf(PropTypes.shape({
        permissions: PropTypes.arrayOf(PropTypes.string)
      })
    )
  }).isRequired
};
