import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material'
import { ShowroomEntriesQuery } from '../../graphql/queries'
import Loading from '../../shared/Loading'
import ErrorPage from '../../components/Error'
import TblPagination from '../../components/TblPagination'
import {dateTimeToString, dateToString} from '../../components/DateContainer'

const useStyles = makeStyles({
    table: {
        display: 'block',
        width: '100%',
        overflowX: 'auto'
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'right',
        width: '100%'
    }
})

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontSize: 15,
        textAlign: 'center'
    },
    body: {
        fontSize: 14,
        textAlign: 'center'
    }
}))(TableCell)

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        }
    }
}))(TableRow)

export default function ShowroomLogs() {
    const classes = useStyles()
    const [offset, setOffset] = React.useState(0)

    const limit = 30

    function handleChangePage() {
        setOffset(limit + offset)
    }


    function handlePreviousPage() {
        if (offset < limit) {
            return;
        }
        setOffset(offset - limit);
    }
    const { loading, error, data } = useQuery(ShowroomEntriesQuery,
        {
            variables: { offset, limit }, fetchPolicy: "cache-and-network"
        });

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />
    return (
      <div>
        <div className="row justify-content-center">
          <div className="container">

            <>

              <Table className={classes.table} aria-label="customized table">

                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Phone Number</StyledTableCell>
                    <StyledTableCell align="right">Email</StyledTableCell>
                    <StyledTableCell align="right">NRC</StyledTableCell>
                    <StyledTableCell align="right">Home Address</StyledTableCell>
                    <StyledTableCell align="right">Reason</StyledTableCell>
                    <StyledTableCell align="right">Date</StyledTableCell>
                    <StyledTableCell align="right">Time</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  {data.showroomEntries.map(entry => (
                    <StyledTableRow key={entry.id}>

                      <StyledTableCell component="th" scope="row">{entry.name}</StyledTableCell>
                      <StyledTableCell align="right">{entry.phoneNumber}</StyledTableCell>
                      <StyledTableCell align="right">{entry.email || "None"}</StyledTableCell>
                      <StyledTableCell align="right">{entry.nrc}</StyledTableCell>
                      <StyledTableCell align="right">{entry.homeAddress}</StyledTableCell>
                      <StyledTableCell align="right">{entry.reason}</StyledTableCell>
                      <StyledTableCell align="right">{dateToString(entry.createdAt)}</StyledTableCell>
                      <StyledTableCell align="right">{dateTimeToString(entry.createdAt)}</StyledTableCell>

                    </StyledTableRow>
                                ))}

                </TableBody>
              </Table>

              <TblPagination
                limit={limit}
                handleChangePage={handleChangePage}
                handlePreviousPage={handlePreviousPage}
                offset={offset}
                length={data.showroomEntries.length}
              />

            </>

          </div>
        </div>
      </div>
    )
}