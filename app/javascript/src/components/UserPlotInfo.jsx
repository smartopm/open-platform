import React from 'react'
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import { dateToString } from '../components/DateContainer'
import { Grid } from '@material-ui/core'
import GeoData from '../data/nkwashi_plots.json'
import GeoMap from './Map/GeoMap'

/**
 * @param {object} jsonData
 * @param {string} value
 * @description return feature in geodata that matches property name
 * @example getPropertyByName(data, 'Basic')
 * @returns {object}
 */
function getPropertyByName(jsonData, value) {
  const data = jsonData.features
  const property = data.filter(feature =>
    value.includes(feature.properties.name)
  )
  return property
}

export function UserPlotInfo({accounts}) { 
  let land_parcels = []
  let plotNumber = []
  accounts &&
  accounts.forEach(account => {
    land_parcels = [...land_parcels, ...account.landParcels]
  })

land_parcels &&
  land_parcels.forEach(plot => {
    plotNumber = [plot.parcelNumber]
  })

  function plotInformation() {
    return (
      <div className="container">
        <p data-testid="no_plot">No plots information available. </p>
      </div>
    )
  }

  if (accounts && accounts.length > 0 && land_parcels.length > 0) {
    const convertedDateTime = dateToString(accounts[0].updatedAt)
    
    let features = getPropertyByName(GeoData, plotNumber)

    return (
      <>
      <div className="container">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <p>Plots associated with this account:</p>
            <ol data-testid="parcel_list">
              {land_parcels.map((plot, index) => (
                <li key={index}>{plot.parcelNumber}</li>
              ))}
            </ol>
            <p>
              This data was updated on {convertedDateTime}. If Something seems
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
            </p>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <GeoMap GeoJSONData={features} />
          </Grid>
        </Grid>
      </div>
      </>
    )
  }
  return plotInformation()
}

const styles = StyleSheet.create({
  supportLink: {
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  routeLink: {
    textDecoration: 'underline',
    color: 'black'
  }
})
