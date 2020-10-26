/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import PropTypes from 'prop-types'
import {  Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CreateIcon from '@material-ui/icons/Create';
import { dateToString } from "./DateContainer"
import GeoData from '../data/nkwashi_plots.json'
import PlotModal from "./PlotOpen"
import EditModal from './EditPlot'

export default function UserPlotInfo({ userId, account, refetch }) {
  function getPropertyByName(jsonData, value) {
    const data = jsonData.features
    const property = data.filter(feature =>
      value.includes(feature.properties.name)
    )
    return property
  }

  const [plotNumber, setPlotNumber] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [plotData, setPlotData] = useState({})

  function handlePlotData(plot){
    setPlotData(plot)
    setEditOpen(true)
  } 

  function setData(){
    if (account[0]?.landParcels[0]){
      account[0].landParcels.forEach(plot => {
        setPlotNumber(...plotNumber, ...plot.parcelNumber)
      })
    }
  }

  useEffect(() => {
    setData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

    const history = useHistory() 

    const features = getPropertyByName(GeoData, plotNumber)
    return (
      <>
        {account[0]?.landParcels?.length > 0 ? (
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
                {account[0].landParcels.map((plot, index) => (
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
                  {dateToString(account[0]?.updatedAt)}
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
          <div className="container" style={{display: 'flex', margin: '20px 150px'}}>
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
        <PlotModal open={addOpen} handleClose={() => setAddOpen(false)} accountId={account[0]?.id} userId={userId} refetch={refetch} />
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

UserPlotInfo.defaultProps = {
  userId: '',
  account: []
 }
UserPlotInfo.propTypes = {
  account: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      landParcels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        plotNumber: PropTypes.string
      })),
      updatedAt: PropTypes.string
    })),
  refetch: PropTypes.func.isRequired,
  userId: PropTypes.string
}
