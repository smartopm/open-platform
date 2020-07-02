import React, {Fragment} from 'react'
import Nav from '../../components/Nav'
import DiscussionList from '../../components/Discussion/DiscussionList'
import {DDiscussionsQuery} from '../../graphql/queries'

export default function Discussions() {
    return (

        <div>
            <Fragment>
                <Nav navName="Discussion Topics" menuButton="back" backTo="/" />
                <DiscussionList />
            </Fragment>

        </div>
    )
}
