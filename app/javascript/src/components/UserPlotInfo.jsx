/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import { useQuery } from 'react-apollo'
import {  Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CreateIcon from '@material-ui/icons/Create';
import { dateToString } from "./DateContainer"
import GeoData from '../data/nkwashi_plots.json'
import PlotModal from "./PlotOpen"
import EditModal from './EditPlot'
import { UserAccountQuery } from '../graphql/queries'
import ErrorPage from "./Error"
import Loading from './Loading'

export default function UserPlotInfo({ userId }) {
  function getPropertyByName(jsonData, value) {
    const data = jsonData.features
    const property = data.filter(feature =>
      value.includes(feature.properties.name)
    )
    return property
  }

  const [landParcel, setLandParcel] = useState([])
  const [plotNumber, setPlotNumber] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [plotData, setPlotData] = useState({})

  const { data: {user: {accounts}}, error, loading, refetch } = useQuery(UserAccountQuery, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  function handlePlotData(plot){
    setPlotData(plot)
    setEditOpen(true)
  } 

  function setData(){
    if (accounts) {
      accounts.forEach(account => {
        setLandParcel([...landParcel, ...account.landParcels])
      })
    }

    if (landParcel.length > 0){
      landParcel.forEach(plot => {
        setPlotNumber(...plotNumber, ...plot.parcelNumber)
      })
    }
  }

  useEffect(() => {
    setData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts])

    const history = useHistory() 

    const features = getPropertyByName(GeoData, plotNumber)
    if (loading) return <Loading />
    if (error) return <ErrorPage title={error.message} />
    return (
      <>
        {accounts && accounts.length > 0 && landParcel.length > 0 ? (
          <div className="container">
            <div className={css(styles.body)}>
              <div>
                <div style={{display: 'flex'}}>
                  <Typography variant='body1'><b>Plots associated with this account:</b></Typography>
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                  <div 
                    style={{display: 'flex', marginLeft: 'auto', order: 2, color: '#69aba4', cursor: 'pointer'}}
                    onClick={() => setAddOpen(true)}
                  >
                    <AddIcon style={{marginRight: '5px', paddingBottom: '2px'}} />
                    <Typography variant='body2'>Add Plots</Typography>
                  </div>
                </div>
                {landParcel.map((plot, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div style={{display: 'flex'}} key={index}>
                    <li className={css(styles.plotNumber)}>{plot.parcelNumber}</li>
                    <div style={{margin: '20px 10px', color: '#69ABA4', cursor: 'pointer'}}>
                      <Tooltip title="Edit Plot" placement="top">
                        <CreateIcon onClick={() => handlePlotData(plot)} />
                      </Tooltip>
                    </div>
                  </div>
                ))}
                <Typography variant='body2'>
                  This data was updated on 
                  {' '}
                  {dateToString(accounts[0]?.updatedAt)}
                  . If Something seems
                  incorrect, contact our
                  <span className={css(styles.supportLink)}>
                  &nbsp;
                    <Link
                      data-testid="support_link"
                      to="/contact"
                      className={css(styles.routeLink)}
                    >
                      Support Team.
                    </Link>
                  </span>
                </Typography>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => history.push({ pathname: '/myplot', state: { features } })}
                  className={`${css(styles.chatButton)}`}
                >
                  My Plot Location
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <p data-testid="no_plot">No plots information available. </p>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
            <div 
              style={{display: 'flex', marginLeft: 'auto', order: 2, color: '#69aba4', cursor: 'pointer'}}
              onClick={() => setAddOpen(true)}
            >
              <AddIcon style={{marginRight: '5px', paddingBottom: '2px'}} />
              <Typography variant='body2'>Add Plots</Typography>
            </div>
          </div>
        )}
        <PlotModal open={addOpen} handleClose={() => setAddOpen(false)} accountId={accounts[0]?.id} userId={userId} refetch={refetch} />
        <EditModal open={editOpen} handleClose={() => setEditOpen(false)} refetch={refetch} data={plotData} />
      </>
    )
  }

const styles = StyleSheet.create({
  supportLink: {
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  plotNumber: {
    listStyle: 'none',
    background: '#fafefe',
    padding: '10px',
    width: '30%',
    margin: '10px',
    textAlign: 'center',
    border: '2px solid #69aba4',
    color: '#69aba4'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',       
    alignItems: 'center'
  },
  routeLink: {
    textDecoration: 'underline',
    color: 'black'
  },
  chatButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF',
    width: '100%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50
  }
})
