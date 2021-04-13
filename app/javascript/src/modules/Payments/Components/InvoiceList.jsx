/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { CSVLink } from "react-csv";
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router';
import { Grid, List, IconButton } from '@material-ui/core'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery, useLazyQuery, useMutation } from 'react-apollo';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CenteredContent from '../../../components/CenteredContent';
import Paginate from '../../../components/Paginate';
import { InvoicesQuery, InvoicesStatsDetails } from '../../../graphql/queries';
import {
  formatError,
  useParamsQuery,
  InvoiceStatusColor,
  propAccessor,
  formatMoney,
  handleQueryOnChange
} from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';
import {
  invoiceStatus,
  invoiceQueryBuilderConfig,
  invoiceQueryBuilderInitialValue,
  invoiceFilterFields } from '../../../utils/constants';
import DataList from '../../../shared/list/DataList';
import Label from '../../../shared/label/Label';
import SearchInput from '../../../shared/search/SearchInput';
import useDebounce from '../../../utils/useDebounce';
import Text from '../../../shared/Text';
import InvoiceDetails from './InvoiceDetail';
import ListHeader from '../../../shared/list/ListHeader';
import currencyTypes from '../../../shared/types/currency';
import InvoiceGraph from './InvoiceGraph'
import QueryBuilder from '../../../components/QueryBuilder'
import MenuList from '../../../shared/MenuList';
import { InvoiceCancel } from '../../../graphql/mutations'
import MessageAlert from "../../../components/MessageAlert"
import DeleteDialogueBox from '../../../components/Business/DeleteDialogue'
import { Spinner } from '../../../shared/Loading';

const invoiceHeaders = [
  { title: 'Issue Date', col: 2 },
  { title: 'Description', col: 4 },
  { title: 'Amount', col: 3 },
  { title: 'Payment Date', col: 3 },
  { title: 'Status', col: 4 },
  { title: 'Menu', col: 4 }
];

const csvHeaders = [
  { label: "Plot Number", key: "landParcel.parcelNumber" },
  { label: "Invoice Number", key: "invoiceNumber" },
  { label: "Amount", key: "amount" },
  { label: "Status", key: "status" },
  { label: "Payment Date", key: "payments[0].createdAt" },
  { label: "Created Date", key: "createdAt" },
  { label: "Due Date", key: "dueDate" },
  { label: "User Name", key: "user.name" },
  { label: "Phone Number", key: "user.phoneNumber" },
  { label: "Email", key: "user.email" }
];
export default function InvoiceList({ currencyData, userType }) {
  const classes = useStyles();
  const menuList = [
    { content: 'Cancel Invoice', isAdmin: true, color: 'red', handleClick}
  ]
  const history = useHistory();
  const path = useParamsQuery();
  const limit = 50;
  const page = path.get('page');
  const pageNumber = Number(page);
  const [searchValue, setSearchValue] = useState('');
  const [listType, setListType] = useState('nongraph')
  const debouncedValue = useDebounce(searchValue, 500);
  const [query, setQuery] = useState('')
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [displayBuilder, setDisplayBuilder] = useState('none')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [invoiceId, setInvoiceId] = useState(false)
  const [name, setName] = useState('')
  const [cancelInvoice] = useMutation(InvoiceCancel)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')

  function handleOpenMenu(event) {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  function handleClick(event, invId, nam){
    event.stopPropagation()
    setInvoiceId(invId)
    setName(nam)
    setModalOpen(true)
  }

  function handleDeleteClose(event){
    event.stopPropagation()
    setModalOpen(false)
  }

  function handleOnClick(event) {
    event.stopPropagation()
    cancelInvoice({
      variables: {
        invoiceId
      }
    }).then(() => {
      setAnchorEl(null)
      setMessageAlert('Invoice successfully cancelled')
      setIsSuccessAlert(true)
      setModalOpen(false)
      refetch()
    })
    .catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  const { loading, data: invoicesData, error, refetch } = useQuery(InvoicesQuery, {
    variables: { limit, offset: pageNumber, query: debouncedValue || searchQuery },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function setGraphQuery(qu){
    setQuery(qu.noOfDays)
    loadInvoiceDetail()
    setListType('graph')
  }

  function setsearch(event){
    setSearchValue(event)
    setListType('nongraph')
  }

  function setSearchClear(){
    setSearchValue('')
    setListType('nongraph')
  }

  const [loadInvoiceDetail, {  error: statError, data: invoicesStatData } ] = useLazyQuery(InvoicesStatsDetails,{
    variables: { query },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  const menuData = {
    menuList,
    handleOpenMenu,
    anchorEl,
    open,
    userType,
    handleClose
  }

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return;
      history.push(`/payments?page=${pageNumber - limit}`);
    } else if (action === 'next') {
      if (invoicesData?.invoices.length < limit) return;
      history.push(`/payments?page=${pageNumber + limit}`);
    }
  }

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none')
    } else {
      setDisplayBuilder('')
    }
  }

  function queryOnChange(selectedOptions) {
    setSearchQuery(handleQueryOnChange(selectedOptions, invoiceFilterFields))
    setListType('nongraph')
  }

  if (error && !invoicesData) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  if (statError) {
    return <CenteredContent>{formatError(statError.message)}</CenteredContent>;
  }

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <SearchInput
        title='Invoices'
        searchValue={searchValue}
        handleSearch={event => setsearch(event.target.value)}
        // Todo: add a proper filter toggle function
        handleFilter={toggleFilterMenu}
        handleClear={() => setSearchClear()}
      />
      <Grid
        container
        justify="flex-end"
        style={{
              width: '100.5%',
              position: 'absolute',
              zIndex: 1,
              marginTop: '-2px',
              marginLeft: '-250px',
              display: displayBuilder
            }}
      >
        <QueryBuilder
          handleOnChange={queryOnChange}
          builderConfig={invoiceQueryBuilderConfig}
          initialQueryValue={invoiceQueryBuilderInitialValue}
          addRuleLabel="Add filter"
        />
      </Grid>
      <br />
      <br />
      <InvoiceGraph handleClick={setGraphQuery} />
      <DeleteDialogueBox
        open={modalOpen}
        handleClose={(event) => handleDeleteClose(event)}
        handleAction={(event) => handleOnClick(event)}
        title='Invoice'
        action='delete'
        user={name}
        additionalNote='The refund amount will be added to unallocated funds.'
      />
      {listType === 'graph' && invoicesStatData?.invoicesStatDetails?.length > 0 && (
        <Fab color="primary" variant="extended" className={classes.download}>
          <CSVLink data={invoicesStatData.invoicesStatDetails} style={{color: 'white'}} headers={csvHeaders} filename="invoice-data.csv">Download CSV</CSVLink>
        </Fab>
      )}
      {listType === 'nongraph' && invoicesData?.invoices.length > 0 && (
        <Fab color="primary" variant="extended" className={classes.download}>
          <CSVLink data={invoicesData.invoices} style={{color: 'white'}} headers={csvHeaders} filename="invoice-data.csv">Download CSV</CSVLink>
        </Fab>
      )}
      {loading ? (<Spinner />) : (
        <List>
          {
          listType === 'graph' && invoicesStatData?.invoicesStatDetails?.length > 0 ?
        (
          <div>
            {matches && <ListHeader headers={invoiceHeaders} />}
            {
              invoicesStatData.invoicesStatDetails.map((invoice) => (
                <InvoiceItem
                  invoice={invoice}
                  key={invoice.id}
                  currencyData={currencyData}
                  menuData={menuData}
                />
              ))
            }
          </div>
        ) : listType === 'nongraph' && invoicesData?.invoices.length > 0 ? (
          <div>
            {matches && <ListHeader headers={invoiceHeaders} />}
            {
              invoicesData.invoices.map((invoice) => (
                <InvoiceItem
                  invoice={invoice}
                  key={invoice.id}
                  currencyData={currencyData}
                  menuData={menuData}
                />
              ))
            }
          </div>
        ) : (
          <CenteredContent>No Invoices Available</CenteredContent>
        )
        }
        </List>
      )}

      <CenteredContent>
        <Paginate
          offSet={pageNumber}
          limit={limit}
          active={pageNumber >= 1}
          handlePageChange={paginate}
          count={invoicesData?.invoices.length}
        />
      </CenteredContent>
    </>
  );
}

/**
 *
 * @param {object} invoices list of tasks
 * @param {function} handleOpenMenu a function that opens the menu for each task
 * @param {object} currencyData community currencyData current and locale
 * @returns {object} an object with properties that DataList component uses to render
 */
export function renderInvoice(invoice, currencyData, menuData) {
  return [
    {
      'Issue Date': (
        <Grid item xs={12} md={2} data-testid="issue_date">
          <Text content={dateToString(invoice?.createdAt)} />
          <br />
        </Grid>
      ),
      Description: (
        <Grid item xs={12} md={2} data-testid="description">
          <Link to={`/user/${invoice.user.id}?tab=Payments`} style={{ textDecoration: 'none'}}>
            <div style={{ display: 'flex', marginTop: '10px'}}>
              <Avatar src={invoice.user?.imageUrl} alt="avatar-image" />
              <span style={{ margin: '7px', fontSize: '12px' }}>{invoice.user?.name}</span>
            </div>
          </Link>
          <br />
          <Text content={`Invoice #${invoice.invoiceNumber}`} />
          <br />
          <Text color="primary" content={`Plot #${invoice.landParcel.parcelNumber}`} />
        </Grid>
      ),
      Amount: (
        <Grid item xs={12} md={2} data-testid="invoice_amount">
          <Text content={formatMoney(currencyData, invoice.amount)} />
        </Grid>
      ),
      'Payment Date': (
        <Grid item xs={12} md={2}>
          {invoice.status === 'paid' && invoice.payments.length ? (
            <Text content={dateToString(invoice.payments[0]?.createdAt)} />
          ) : (
            '-'
          )}
        </Grid>
      ),
      Status: (
        <Grid item xs={12} md={2} data-testid="status">
          {new Date(invoice.dueDate) < new Date().setHours(0, 0, 0, 0) &&
          invoice.status === 'in_progress' ? (
            <Label title="Due" color="#B63422" />
          ) : (
            <Label
              title={propAccessor(invoiceStatus, invoice.status)}
              color={propAccessor(InvoiceStatusColor, invoice.status)}
            />
          )}
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} md={1} data-testid="menu">
          {
                invoice.status !== 'cancelled' && (
                  <IconButton
                    aria-label='more-verticon'
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => menuData.handleOpenMenu(event)}
                    dataid={invoice.id}
                    name={invoice.user.name}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                )
              }
          <MenuList
            open={menuData.open && menuData.anchorEl?.getAttribute('dataid') === invoice.id}
            anchorEl={menuData.anchorEl}
            userType={menuData.userType}
            handleClose={menuData.handleClose}
            list={menuData.menuList}
          />
        </Grid>
      )
    }
  ];
}

export function InvoiceItem({invoice, currencyData, menuData}){
  const [detailsOpen, setDetailsOpen] = useState(false)
  return (
    <div>
      <InvoiceDetails
        detailsOpen={detailsOpen}
        handleClose={() => setDetailsOpen(false)}
        data={invoice}
        currencyData={currencyData}
      />
      <DataList
        keys={invoiceHeaders}
        data={renderInvoice(invoice, currencyData, menuData)}
        hasHeader={false}
        clickable
        handleClick={() => setDetailsOpen(true)}
      />
    </div>
  )
}

const useStyles = makeStyles(() => ({
  download: {
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    zIndex: '1000'
  }
}));
InvoiceList.propTypes = {
  currencyData: PropTypes.shape({ ...currencyTypes }).isRequired,
  userType: PropTypes.string.isRequired
};
InvoiceItem.propTypes = {
  invoice: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({ ...currencyTypes }).isRequired,
  menuData: PropTypes.object.isRequired
}