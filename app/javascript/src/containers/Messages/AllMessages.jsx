/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import { MenuItem, FormControl, Select, InputLabel } from '@material-ui/core';
import useDebounce from '../../utils/useDebounce'
import { useWindowDimensions } from '../../utils/customHooks'
import { useStyles } from '../../modules/Users/Containers/Users';
import { messageFilters } from '../../utils/constants';
import { MessagesQuery } from '../../graphql/queries'
import CenteredContent from '../../shared/CenteredContent'
import ErrorPage from '../../components/Error'
import MessageList from '../../components/Messaging/MessageList'
import { Spinner } from '../../shared/Loading';

const limit = 50
export default function AllMessages() {
    const { width } = useWindowDimensions()
    const classes = useStyles()
    const [offset, setOffset] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchTermCurrent, setSearchTermCurrent] = useState('')
    const dbcSearchTerm = useDebounce(searchTermCurrent, 500);
    const [category, setCategory] = useState("")
    const { t } = useTranslation(['message', 'common'])

    useEffect(
        () => {
            setSearchTerm(dbcSearchTerm)
        },
        [dbcSearchTerm]
    );

    const { loading, error, data, refetch } = useQuery(MessagesQuery, {
        variables: {
            searchTerm,
            offset,
            limit,
            filter: category
        }
    });
    if (error) return <ErrorPage error={error.message} />

    function handleNextPage() {
        setOffset(offset + limit)
    }
    function handlePreviousPage() {
        if (offset < limit) {
            return
        }
        setOffset(offset - limit)
    }

    function handleFilter(event){
        setCategory(event.target.value)
        // refetch after changing filter 
    }

    function handleSearch() {
        refetch()
    }

    function handleChange(event) {
        setOffset(0)
        setSearchTermCurrent(event.target.value)
    }

    return (
      <>
        <div className={width > 1000 ? 'container' : 'container-fluid'}>

          <OutlinedInput
            value={searchTermCurrent}
            onChange={handleChange}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleSearch}
                  onMouseDown={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
                      )}
            aria-describedby="search messages input"
            inputProps={{ 'aria-label': 'search'}}
            fullWidth
            labelWidth={0}
            placeholder={t('common:form_placeholders.message_search')}
          />
        </div>
        <CenteredContent>
          <FormControl className={classes.formControl}>
            <InputLabel id="category-filter">{t('common:misc.filter_message_by_category')}</InputLabel>
            <Select
              labelId="category-filter"
              id="demo-controlled-open-select"
              value={category}
              onChange={handleFilter}
            >
              {
                messageFilters.map(filter => (
                  <MenuItem key={filter.value} value={filter.value}>{filter.title}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </CenteredContent>

        {
        // eslint-disable-next-line no-nested-ternary
        loading ? (
          <CenteredContent> 
            {' '}
            <Spinner />
            {' '}
          </CenteredContent>
            ) : 
            data && data.messages ? (
              <div>
                <MessageList messages={data.messages} />
                <div className="d-flex justify-content-center">
                  <nav aria-label="center Page navigation">
                    <ul className="pagination">
                      <li className={`page-item ${offset < limit && 'disabled'}`}>
                        <a className="page-link" onClick={handlePreviousPage} href="#">
                          {t('common:misc.previous')}
                        </a>
                      </li>
                      <li className={`page-item ${data.messages.length < limit &&
                                        'disabled'}`}
                      >
                        <a className="page-link" onClick={handleNextPage} href="#">
                          {t('common:misc.next')}
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

            ) : null 
}
      </>
    )
}
