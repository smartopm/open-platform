import React from 'react'
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import { dateToString } from '../components/DateContainer'
import { Grid } from '@material-ui/core'
import GeoData from '../data/nkwashi_plots.json'
import GeoMap from './Map/GeoMap'
// Todo: Refactor this to use best practices of React

export function UserPlotInfo(props) {
  let { accounts } = props
  let land_parcels = []
  accounts &&
    accounts.forEach(account => {
      land_parcels = [...land_parcels, ...account.landParcels]
    })
/**
 * 
 * @param {object} jsonData 
 * @param {string} value 
 * @description return feature in geodata that matches property name 
 * @example getPropertyByName(data, 'Basic')
 * @returns {object}
 */
function getPropertyByName(jsonData, value) {
  const data = jsonData.features
  const property = data.filter(feature => feature.properties.name === value)
  return property
}
  function plotInformation() {
    return (
      <div className="container">
        <p data-testid="no_plot">No plots information available. </p>
      </div>
    )
  }
  if (accounts && accounts.length > 0 && land_parcels.length > 0) {
    const convertedDateTime = dateToString(accounts[0].updatedAt)
    return (
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
          <Grid item md={12}>
            {/* {
              land_parcels.map(plot =>{

              })
            } */}
            <GeoMap GeoJSONData={GeoData} />
          </Grid>
          
        </Grid>
      </div>
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
