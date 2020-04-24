import React, { Fragment } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

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
}))

export const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#25c0b0',
        color: theme.palette.common.white,
        fontSize: 15,
        textAlign: 'center'
    },
    body: {
        fontSize: 14,
        textAlign: 'center'
    }
}))(TableCell)

export const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        }
    }
}))(TableRow)

export default function DataTable({ columns, children }) {
    const classes = useStyles()
    return (
        <div className="container">
            <Fragment>
                <Table className={classes.table, "tableClass"} >
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell key={column.id}>
                                    {column.label}
                                </StyledTableCell>
                                  
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            {children}
                    </TableBody>
                </Table>
            </Fragment>
        </div>
    );

}

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    children: PropTypes.node,
   
}