import React from 'react'
import { Card, CardMedia, CardContent, Typography, Divider, Box, Container } from '@material-ui/core'
import PropTypes from 'prop-types'
export default function PostContent({response}) {
    return (
        <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#F1F1F1', flex: 1 }}>
            <Container>
                <Box >
                    <Card style={{ marginTop: 100 }}>
                        <CardMedia style={{
                            height: 0,
                            width: "100%",  
                            paddingTop: "50%",
                        }}
                            image={response.post_thumbnail?.URL} />
                        <CardContent >
                            <Typography variant='h3' color='textSecondary'>
                                <strong>{response.title}</strong>
                            </Typography>

                            <Divider light variant='middle' />

                            <div dangerouslySetInnerHTML={{ __html: response.content }} />

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