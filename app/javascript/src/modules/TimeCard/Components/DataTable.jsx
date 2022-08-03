import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  table: {
    display: 'block',
    width: '100%',
    overflowX: 'auto',
    height: 500
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'right',
    width: '100%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

export const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.main,
    color: theme.palette.common.white,
    fontSize: 15,
    textAlign: 'center'
  },
  body: {
    fontSize: 14,
    textAlign: 'center'
  }
}))(TableCell);

export const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

export default function DataTable({ columns, children }) {
  const classes = useStyles();
  return (
    <div className="container" data-testid='data_table_container'>
      <>
        <Table className={(classes.table, 'tableClass')}>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <StyledTableCell key={`${index}-${column}`}>{column}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </>
    </div>
  );
}

DataTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node
};
