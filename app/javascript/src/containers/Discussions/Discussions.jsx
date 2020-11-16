import React, { useState, useContext } from 'react'
import { Fab, useMediaQuery, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core'
import { useMutation, useQuery } from 'react-apollo'
import { css } from 'aphrodite'
import { useTheme } from '@material-ui/core/styles';
import Nav from '../../components/Nav'
import DiscussionList from '../../components/Discussion/DiscussionList'
import { DiscussionsQuery } from '../../graphql/queries'
import Loading, { Spinner } from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { styles } from '../../components/ShareButton'
import CenteredContent from '../../components/CenteredContent'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'
import TitleDescriptionForm from '../../components/Forms/TitleDescriptionForm';
import { DiscussionMutation } from '../../graphql/mutations';

export default function Discussions() {
    const limit = 20
    const { loading, error, data, refetch, fetchMore } = useQuery(DiscussionsQuery, {
        variables: { limit }
    })
    const [createDiscuss] = useMutation(DiscussionMutation)
    const [open, setOpen] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [message, setMessage] = useState(false)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const authState = useContext(AuthStateContext)
    const { user: { userType } } = authState
    
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
                return { ...prev, discussions: [...prev.discussions, ...fetchMoreResult.discussions]}
            }
        })
    }

    function saveDiscussion(title, description){
      setLoading(true)
      createDiscuss({ variables: { title, description } })
        .then(() => {
          setMessage('Discussion created')
          setLoading(false)
          setTimeout(() => {
            updateList()
          }, 1000)
          setOpen(!open)
        })
        .catch((err) => {
          setLoading(false)
          setMessage(err.message)
        })
    }

    if (loading) return <Loading />
    if (error) {
        return <ErrorPage title={error.message || error} />
    }
    return (
      <div>
        <>
          <Nav navName="Discussion Topics" menuButton="back" backTo="/" />
          <Dialog
            fullScreen={fullScreen}
            open={open}
            fullWidth
            maxWidth="lg"
            onClose={openModal}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              <CenteredContent>
                <span>Create a discussion topic</span>
              </CenteredContent>
            </DialogTitle>
            <DialogContent>
              <TitleDescriptionForm 
                close={updateList} 
                type="discussion" 
                save={saveDiscussion} 
                data={{
                  loading: isLoading,
                  msg: message
                }} 
              />
            </DialogContent>
          </Dialog>
                
          <DiscussionList data={data.discussions} refetch={refetch} isAdmin={authState.user.userType === 'admin'} />
          {
                    data.discussions.length >= limit && (
                    <CenteredContent>
                      <Button
                        variant="outlined"
                        onClick={fetchMoreDiscussions}
                      >
                        {isLoading ? <Spinner /> : 'Load more discussions'}
                      </Button>
                    </CenteredContent>
                    )
                }
          {userType === 'admin' && (
            <Fab
              variant="extended"
              onClick={openModal}
              className={`btn ${css(styles.getStartedButton)} `}
            >
              Create discussion topic
            </Fab>
                )}
        </>
      </div>
    )
}
