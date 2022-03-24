/* eslint-disable */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";;
import { IconButton, Typography, Grid } from '@material-ui/core';
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  total: {
    marginBottom: 20,
    padding: theme.spacing(2)
  },
  button: {
    marginTop: 0
  },

  text: {
    marginBottom: 15,
    alignItems: "flex-end",
    justify: "flex-end"

  }
}));

export default function TblPagination({ limit, handlePreviousPage, handleChangePage, offset, length }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-end"
        spacing={2}

      >
        <Grid item xs={6} className={classes.text}>
          <Typography variant="body2" align="right">
            Rows on page:{' ' + length}
          </Typography>
        </Grid>
        <Grid item xs={false}>
          <IconButton disabled={offset < limit } onClick={handlePreviousPage} className={classes.button}>
            <NavigateBeforeIcon />

          </IconButton>
        </Grid>
        <Grid item xs={false}>
          <IconButton disabled={length < limit } onClick={handleChangePage}>
            <NavigateNextIcon />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}

TblPagination.propTypes = {
  handlePreviousPage: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired
}
