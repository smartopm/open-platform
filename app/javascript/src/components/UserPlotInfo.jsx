import React from 'react';
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import dateutil from '../utils/dateutil';

export function UserPlotInfo(props) {
    let { accounts } = props;
    let land_parcels = [];
    accounts && accounts.forEach((account) => {
        land_parcels = [...land_parcels, ...account.landParcels]
    });
    let plotInformation = <p>No Plots associated with this account!</p>
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
            <ol data-testid="pn">
                {
                    land_parcels.map((plot, index) => <li key={index}>{plot.parcelNumber}</li>)
                }
            </ol>
            <p>This data was updated on {convertedDateTime}. If Something seems incorrect, contact our
           <span className={css(styles.supportLink)}>&nbsp;
           <Link
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
