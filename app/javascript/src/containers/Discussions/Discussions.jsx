/* eslint-disable */
import React, { Fragment } from 'react'
import { Fab, useMediaQuery, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core'
import Nav from '../../components/Nav'
import DiscussionList from '../../components/Discussion/DiscussionList'
import { DiscussionsQuery } from '../../graphql/queries'
import { useQuery } from 'react-apollo'
import Loading, { Spinner } from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { css } from 'aphrodite'
import { styles } from '../../components/ShareButton'
import Discuss from '../../components/Discussion/Discuss'
import { useTheme } from '@material-ui/core/styles';
import CenteredContent from '../../components/CenteredContent'
import { useState } from 'react'

export default function Discussions() {
    const limit = 20
    const { loading, error, data, refetch, fetchMore } = useQuery(DiscussionsQuery, {
        variables: { limit }
    })
    const [open, setOpen] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    
    function openModal() {
        setOpen(!open)
    }
    function updateList() {
        refetch()
        setOpen(!open)
    }

    function fetchMoreDiscussions() {
        setLoading(true)
        fetchMore({
            variables: { offset: data.discussions.length },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev
                setLoading(false)
                return Object.assign({}, prev, {
                    discussions: [...prev.discussions, ...fetchMoreResult.discussions]
                })
            }
        })
    }

    if (loading) return <Loading />
    if (error) {
        return <ErrorPage title={error.message || error} />
    }
    return (
        <div>
            <Fragment>
                <Nav navName="Discussion Topics" menuButton="back" backTo="/" />
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    fullWidth={true}
                    maxWidth={'lg'}
                    onClose={openModal}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        <CenteredContent>
                            <span>Create a discussion topic</span>
                        </CenteredContent>
                    </DialogTitle>
                    <DialogContent>
                        <Discuss update={updateList}/>
                    </DialogContent>
                </Dialog>
                
                <DiscussionList data={data.discussions} />
                {
                    data.discussions.length >= limit && (
                        <CenteredContent>
                            <Button
                                variant="outlined"
                                onClick={fetchMoreDiscussions}>
                                {isLoading ? <Spinner /> : 'Load more discussions'}
                            </Button>
                        </CenteredContent>
                    )
                }

                <Fab variant="extended"
                    onClick={openModal}
                    className={`btn ${css(styles.getStartedButton)} `}
                >
                    Create discussion topic
                </Fab>
            </Fragment>
        </div>
    )
}
