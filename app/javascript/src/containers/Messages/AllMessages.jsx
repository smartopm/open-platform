import React, { Fragment, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import IconButton from '@material-ui/core/IconButton';
import { MessagesQuery } from '../../graphql/queries'
//import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import MessageList from '../../components/Messaging/MessageList'
import Nav from '../../components/Nav'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import useDebounce  from '../../utils/useDebounce'
import { useWindowDimensions } from '../../utils/customHooks'


const limit = 50
export default function AllMessages() {
    const { width } = useWindowDimensions()
    const [offset, setOffset] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchTermCurrent, setSearchTermCurrent] = useState('')
    const dbcSearchTerm = useDebounce(searchTermCurrent, 500);
    
    useEffect(
        () => {
            setSearchTerm(dbcSearchTerm)
        },
        [dbcSearchTerm]
      );

    const {error, data, refetch } = useQuery(MessagesQuery, { variables: {
        searchTerm,
        offset,
        limit
    }});
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

    function handleSearch(){
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
            {data && data.messages ? (
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
                                <li
                                    className={`page-item ${data.messages.length < limit &&
                                        'disabled'}`}
                                >
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
