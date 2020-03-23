import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import MaterialList from '@material-ui/core/List';
import { List } from "react-virtualized";
import UserMessageItem from './UserMessageItem';
import Nav from '../Nav';
import { useWindowDimensions } from '../../utils/customHooks';

export default function MessageList({ messages }) {
    const { height, width } = useWindowDimensions()

    const listHeight = height;
    const rowHeight = 100;
    const rowWidth = width;
    function renderRow({ index, key, style }) {
        return (
            <div key={key} style={style} className="row">

                <div className="content">
                    <UserMessageItem
                        id={messages[index].user.id}
                        name={messages[index].user.name}
                        imageUrl={messages[index].user.imageUrl}
                        message={messages[index].message}
                        // messageCount={messages[index].messages.length}
                        clientNumber={messages[index].user.phoneNumber}
                    />
                </div>
            </div>
        );
    }
    return (
        <Fragment>
            <Nav navName="Messages" menuButton="back" />
            {
                messages.length ? (
                    <MaterialList>
                        <List
                            width={rowWidth}
                            height={listHeight}
                            rowHeight={rowHeight}
                            rowRenderer={renderRow}
                            rowCount={messages.length}
                            overscanRowCount={3} />
                    </MaterialList>
                )
                    : <p className='text-center'>Some users dont have messages, try Next Page</p>
            }
        </Fragment>
    )
}
MessageList.defaultProps = {
    messages: []
}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
}


