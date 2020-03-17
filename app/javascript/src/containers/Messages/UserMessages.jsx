import React, { useContext, Fragment } from 'react';
import { useParams } from "react-router-dom";
import { useQuery } from 'react-apollo'
import { useHistory } from "react-router-dom";
import { UserMessageQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import TextField from '@material-ui/core/TextField';

export default function UserMessages() {
    const { id } = useParams()
    const { loading, error, data } = useQuery(UserMessageQuery, { variables: { id } })
    const authState = useContext(AuthStateContext)
    let history = useHistory();

    if (authState.user.userType !== 'admin') {
        history.push('/')
    }

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />
    return (
        <Fragment>
            <ul>
                {
                    data.userMessages.length && data.userMessages.map(message => (
                        <li key={message.id}>{message.message}</li>
                    ))
                }
            </ul>
            <br />
            <TextField
                id="standard-full-width"
                label="Label"
                style={{ margin: 8 }}
                placeholder="Placeholder"
                // add character count here
                helperText="120"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Fragment>
    )
}

