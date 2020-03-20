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
    const rowHeight = 70;
    const rowWidth = width;
    function renderRow({ index, key, style }) {
        return (
            <div key={key} style={style} className="row">
                <div className="content">
                    <UserMessageItem
                        id={messages[index].id}
                        name={messages[index].name}
                        imageUrl={messages[index].imageUrl}
                        message={messages[index].messages.length ? messages[index].messages[0].message : ''}
                        messageCount={messages[index].messages.length}
                        clientNumber={messages[index].phoneNumber}
                    />
                </div>
            </div>
        );
    }
    return (
        <Fragment>
            <Nav navName="Messages" menuButton="back" />
            <MaterialList>
                <List
                    width={rowWidth}
                    height={listHeight}
                    rowHeight={rowHeight}
                    rowRenderer={renderRow}
                    rowCount={messages.length}
                    overscanRowCount={3} />
            </MaterialList>
        </Fragment>
    )
}
MessageList.defaultProps = {
    messages: []
}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
}

