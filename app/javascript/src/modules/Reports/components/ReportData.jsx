import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import formatCellData from '../utils';

export default function ReportData({ formattedData }) {
    const { t } = useTranslation('form')
  const classes = useStyles();
  let highestRecords = 1;
  return (
    <div className="plan-header" style={{ marginTop: 60 }}>
      <Grid container spacing={5}>
        {Object.keys(formattedData).map(header => {
          if (formattedData[String(header)].length > highestRecords)
            highestRecords = formattedData[String(header)].length;
          return (
            <Grid
              item
              xs
              className={classes.title}
              key={header}
              style={{ fontWeight: 700, color: '#2D2D2D' }}
            >
              {header}
            </Grid>
          );
        })}
      </Grid>
      <Divider className={classes.divider} />
      {Array.from(Array(highestRecords)).map((_val, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid key={i} container direction="row" spacing={2}>
          {Object.keys(formattedData).map(head => (
            <Grid item xs key={head}>
              {formatCellData(formattedData[String(head)][Number(i)], t)}
            </Grid>
          ))}
        </Grid>
      ))}
    </div>
  );
}

ReportData.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formattedData: PropTypes.object.isRequired
};

const useStyles = makeStyles({
  title: {
    fontWeight: 400,
    fontSize: '16px',
    color: '#656565'
  },
  divider: {
    margin: '19px 0 27px 0'
  }
});
