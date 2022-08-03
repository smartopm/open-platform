/* eslint-disable */
import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";;
import { IconButton, Typography, Grid } from '@mui/material';
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
        justifyContent="flex-end"
        alignItems="flex-end"
        spacing={2}

      >
        <Grid item xs={6} className={classes.text}>
          <Typography variant="body2" align="right">
            Rows on page:{' ' + length}
          </Typography>
        </Grid>
        <Grid item xs={false}>
          <IconButton
            disabled={offset < limit }
            onClick={handlePreviousPage}
            className={classes.button}
            size="large">
            <NavigateBeforeIcon />

          </IconButton>
        </Grid>
        <Grid item xs={false}>
          <IconButton disabled={length < limit } onClick={handleChangePage} size="large">
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
