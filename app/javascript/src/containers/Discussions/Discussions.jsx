import React, { Fragment } from 'react'
import { Fab, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'
import Nav from '../../components/Nav'
import DiscussionList from '../../components/Discussion/DiscussionList'
import { DiscussionsQuery } from '../../graphql/queries'
import { useQuery } from 'react-apollo'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { css } from 'aphrodite'
import { styles } from '../../components/ShareButton'
import Discuss from '../../components/Discussion/Discuss'
import { useTheme } from '@material-ui/core/styles';

export default function Discussions() {
    const { loading, error, data, refetch } = useQuery(DiscussionsQuery)
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    function openModal() {
        setOpen(!open)
    }
    function updateList() {
        refetch()
        setOpen(!open)
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
                    <DialogTitle id="responsive-dialog-title">{"Create a discussion topic"}</DialogTitle>
                    <DialogContent>
                        <Discuss update={updateList}/>
                    </DialogContent>
                    {/* <DialogActions>
                        <Button autoFocus onClick={openModal} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={openModal} color="primary" autoFocus>
                                            Agree
                        </Button>
                    </DialogActions> */}
                </Dialog>
                
                <DiscussionList data={data.discussions} />
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
