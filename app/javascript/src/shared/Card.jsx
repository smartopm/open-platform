import React from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function CardComponent({ children }) {
  return (
    <>
      <Card
        elevation={0}
        style={{ border: '1px solid #E0E0E0', marginBottom: '10px' }}
      >
        <CardContent style={{paddingBottom: '16px'}}>
          {children}
        </CardContent>
      </Card>
    </>
  )
}