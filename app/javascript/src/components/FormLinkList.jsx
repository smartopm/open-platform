import React, { useContext } from 'react'
import { Context as AuthStateContext } from '../containers/Provider/AuthStateProvider'
import { List, ListItem, ListItemAvatar, Divider, Typography, Box, Avatar } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment';


export default function FormLinkList() {
    const authState = useContext(AuthStateContext)
    return (
        <div>
            <List data-testid="forms-link-holder" style={{ cursor: 'pointer' }}>

                <ListItem data-testid="forms-link-building-permit" onClick={() => {
                    window.open(
                        'https://docs.google.com/forms/d/e/1FAIpQLSe6JmeKp9py650r7NQHFrNe--5vKhsXa9bFF9kmLAjbjYC_ag/viewform?usp=sf_link',
                        '_blank'
                    )
                }}>
                    <ListItemAvatar data-testid="forms-link-building-icon">
                        <Avatar>
                            <AssignmentIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginLeft: 30
                        }}>
                        <Typography variant="subtitle1" data-testid="forms-building-permit">
                            Building Permit
                        </Typography>
                    </Box>

                </ListItem>

                <Divider variant="middle" />
                <ListItem data-testid="forms-link-crf" onClick={() => {
                    window.open(
                        `https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=${authState.user.name.replace(
                            /\s+/g,
                            '+'
                        )}&entry.1055458143=${
                        authState.user.phoneNumber ? authState.user.phoneNumber : ''
                        }`,
                        '_blank'
                    )
                }}>
                    <ListItemAvatar data-testid="forms-link-crf-icon">
                        <Avatar>
                            <AssignmentIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginLeft: 30
                        }}>
                        <Typography variant="subtitle1" data-testid="forms-crf ">
                            Client Request Form
                        </Typography>
                    </Box>

                </ListItem>



            </List>

        </div>
    )
}
