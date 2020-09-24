/* eslint-disable */
import React, { Fragment, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import IconButton from '@material-ui/core/IconButton';
import { MessagesQuery } from '../../graphql/queries'
import CenteredContent from '../../components/CenteredContent'
import ErrorPage from '../../components/Error'
import MessageList from '../../components/Messaging/MessageList'
import Nav from '../../components/Nav'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import useDebounce from '../../utils/useDebounce'
import { useWindowDimensions } from '../../utils/customHooks'
import { Spinner } from '../../components/Loading';
import { MenuItem, FormControl, Select, InputLabel } from '@material-ui/core';
import { useStyles } from '../Users';


const limit = 50
export default function AllMessages() {
    const { width } = useWindowDimensions()
    const classes = useStyles()
    const [offset, setOffset] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchTermCurrent, setSearchTermCurrent] = useState('')
    const dbcSearchTerm = useDebounce(searchTermCurrent, 500);
    const [category, setCategory] = useState("sms")

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
        <Fragment>
            <Nav navName="Messages" menuButton="back" backTo="/" />
            <div className={width > 1000 ? 'container' : 'container-fluid'}>

                <OutlinedInput
                    value={searchTermCurrent}
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleSearch}
                                onMouseDown={handleSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                    aria-describedby="search messages input"
                    inputProps={{
                        'aria-label': 'search'
                    }}
                    fullWidth
                    labelWidth={0}
                    placeholder="search message content, user name and phone number"
                />
            </div>
                <CenteredContent>
                <FormControl className={classes.formControl}>
                    <InputLabel id="category-filter">Filter by: Category</InputLabel>
                    <Select
                    labelId="category-filter"
                    id="demo-controlled-open-select"
                    value={category}
                    onChange={handleFilter}
                    >
                    <MenuItem value={'sms'}>SMS</MenuItem>
                    <MenuItem value={'email'}>Email</MenuItem>
                    <MenuItem value={'campaign'}>Campaign</MenuItem>
                    <MenuItem value={'non_campaign'}>Non-Campaign</MenuItem>
                    <MenuItem value={'sms/campaign'}>SMS and Campaign</MenuItem>
                    <MenuItem value={'sms/non_campaign'}>SMS and Non-Campaign</MenuItem>
                    <MenuItem value={'email/campaign'}>Email and Campaign</MenuItem>
                    <MenuItem value={'email/non_campaign'}>Email and Non-Campaign</MenuItem>
                    </Select>
                </FormControl>
            </CenteredContent>

            {loading ? <CenteredContent > <Spinner /> </CenteredContent> : 
            data && data.messages ? (
                <div>
                    <MessageList messages={data.messages} />
                    <div className="d-flex justify-content-center">
                        <nav aria-label="center Page navigation">
                            <ul className="pagination">
                                <li className={`page-item ${offset < limit && 'disabled'}`}>
                                    <a className="page-link" onClick={handlePreviousPage} href="#">
                                        Previous
                                     </a>
                                </li>
                                <li className={`page-item ${data.messages.length < limit &&
                                        'disabled'}`}>
                                    <a className="page-link" onClick={handleNextPage} href="#">
                                        Next
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

            ) : null}
        </Fragment>
    )
}
