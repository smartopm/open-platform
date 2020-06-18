import React from 'react'
import { Card, CardMedia, CardContent, Typography, Divider, Box, Container } from '@material-ui/core'
import { useLocation } from 'react-router-dom'

export default function NewsPostPage() {
    let { state } = useLocation()
    console.log(state)
    return (

        <div style={{ height: '100vh', width: '100%', backgroundColor: '#F1F1F1', flex: 1 }}>
            <Container>
                <Box >
                    <Card style={{ marginTop: 100 }}>
                        <CardMedia style={{
                            height: 0,
                            width: "100%",
                            paddingTop: "50%",
                        }} image={state.imageUrl} />
                        <CardContent>
                            <Typography variant='h3' color='textSecondary'>
                                <strong>{state.title}</strong>
                            </Typography>

                            <Divider light variant='middle' />
                        </CardContent>
                        
                    </Card>
                </Box>
                <div dangerouslySetInnerHTML={{ __html: state.content }} />
            </Container>
        </div>

    )
}
