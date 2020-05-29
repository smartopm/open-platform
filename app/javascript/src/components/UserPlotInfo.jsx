import React from 'react';
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import dateutil from '../utils/dateutil';

// Todo: Refactor this to use best practices of React

export function UserPlotInfo(props) {
    let { accounts } = props;
    let land_parcels = [];
    accounts && accounts.forEach((account) => {
        land_parcels = [...land_parcels, ...account.landParcels]
    });
    let plotInformation = <div className="container"><p data-testid="no_plot">No plots information available.</p></div>
    if (accounts && accounts.length > 0 && land_parcels.length > 0) {
        let latestUpdated = new Date(accounts[0].updatedAt);
        accounts.forEach(account => {
            let updated = new Date(account.updatedAt);
            if (updated > latestUpdated) {
                latestUpdated = updated;
            }
        });
        const convertedDateTime = dateutil.dateTimeToCatString(latestUpdated);
        plotInformation = (<div className="container">
            <p>Plots associated with this account:</p>
            <ol data-testid="parcel_list">
                {
                    land_parcels.map((plot, index) => <li key={index}>{plot.parcelNumber}</li>)
                }
            </ol>
            <p>This data was updated on {convertedDateTime}. If Something seems incorrect, contact our
           <span className={css(styles.supportLink)}>&nbsp;
           <Link
                        data-testid="support_link"
                        to='/contact'
                        className={css(styles.routeLink)}
                    >
                        Support Team.
           </Link>
                </span></p>
        </div>)
    }
    return plotInformation;
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
