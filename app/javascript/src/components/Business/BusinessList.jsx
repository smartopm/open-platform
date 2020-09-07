/* eslint-disable */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import { List, ListItem, ListItemAvatar, Divider, Typography, Box, IconButton } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Avatar from '../Avatar'
import BusinessActionMenu from './BusinessActionMenu'

export default function BusinessList({ businessData, authState, refetch }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    function handleOpenMenu(event) {
        setAnchorEl(event.currentTarget)
    }

    function handleClose() {
        setAnchorEl(null)
    }
    return (
        <div className="container">
            <List>
                {
                    businessData.businesses.map(business => (
                        <ListItem key={business.id}>
                            <Link key={business.id} to={`/business/${business.id}`} style={{
                                width: "100%",
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                textDecoration: 'none'
                            }}>
                                <ListItemAvatar>
                                    <Avatar imageUrl={business.imageUrl} style={"medium"} />
                                </ListItemAvatar>
                                <Box
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        marginLeft: 30
                                    }}>
                                    <Typography variant="subtitle1" data-testid="business-name">
                                        {business.name}
                                    </Typography>
                                    <Typography variant="caption" data-testid="business-category">
                                        {business.category}
                                    </Typography>
                                </Box>
                                <Divider variant="middle" />
                            </Link>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={handleOpenMenu}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <BusinessActionMenu
                                authState={authState}
                                data={business}
                                anchorEl={anchorEl}
                                handleClose={handleClose}
                                open={open}
                                linkStyles={css(styles.linkItem)}
                                refetch={refetch}
                            />
                        </ListItem>
                    ))
                }
            </List>

        </div>

    )
}

const styles = StyleSheet.create({
    linkItem: {
        color: '#000000',
        textDecoration: 'none'
    }
})
