import React, {Fragment} from 'react';
import { List, ListItem, Divider, Typography } from '@material-ui/core';

export default function Discussion(data){
    console.log(data)
    return (
        <div className="container">
            <Fragment>

                <Typography variant="h6">{data.data.title}</Typography>
                <Divider  />
            </Fragment>
        </div>
    );
};




