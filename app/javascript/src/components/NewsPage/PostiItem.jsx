import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Box from "@material-ui/core/Box";



export default function PostiItem({ title, imageUrl, datePosted, subTitle }) {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="header" className={classes.avatar}>
                        {title.charAt(0)}
                    </Avatar>
                }
                title={title}
                subheader={datePosted}
            />
            <CardMedia
                className={classes.media}
                image={imageUrl}
                title={title}
            />
            <CardContent>
                <Typography variant="body2" color="textPrimary" component="h2">
                    <div dangerouslySetInnerHTML={{ __html: subTitle }} />
                </Typography>
            </CardContent>
            <CardActions>
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        height: 30,
                        justifyContent: "flex-end",
                        width: "100%"
                    }}
                >
                    <Typography color="textSecondary" component="p">
                        Read More
          </Typography>
                    <ChevronRightIcon />
                </Box>
            </CardActions>
        </Card>

    )
}

// Moved this at the bottom
const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 400,
        cursor: 'pointer',
        margin: 10,
        shadowColor: "#CCE5F3",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6
    },
    media: {
        height: 0,
        width: 400,
        paddingTop: "56.25%", // 16:9,
    },
    avatar: {
        backgroundColor: red[500]
    }
}));