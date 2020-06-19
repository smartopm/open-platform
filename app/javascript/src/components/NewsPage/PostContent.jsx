import React from 'react'
import { Card, CardMedia, CardContent, Typography, Divider, Box, Container } from '@material-ui/core'
import PropTypes from 'prop-types'
export default function PostContent({ response }) {
    return (
        <div style={{ height: '100vh', width: '100%', flex: 1 }}>
            <Container>
                <Box >
                    <Card style={{ marginTop: 30 }}>
                        <CardMedia style={{
                            height: 0,
                            width: "100%",
                            paddingTop: "50%",
                        }}
                            image={response.post_thumbnail?.URL} />
                        <CardContent >
                            <Box style={{ marginLeft: 50, marginRight: 50 }}>
                                <Typography variant='h3' color='textSecondary'>
                                    <strong>{response.title}</strong>
                                </Typography>
                            </Box>
                            <Divider light variant='middle' />
                            <Box style={{ margin: 50 }}>
                                <div dangerouslySetInnerHTML={{ __html: response.content }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </div>
    )
}

PostContent.propType = {
    response: PropTypes.shape({
        post_thumbnail: PropTypes.object,
        title: PropTypes.string,
        content: PropTypes.string,
    }),
}