import React from 'react';
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'

export function ClientPlotInfo(props) {
    let { accounts } = props;
    let land_parcels = [];

    accounts.forEach((account) => {
        land_parcels = [...land_parcels, ...account.landParcels]
    });
    return (
        <div className="container">
            <p>Plots associated with this account:</p>
            <ol data-testid="pn">
                {
                    land_parcels.map((plot, index) => <li key={index}>{plot.parcelNumber}</li>)
                }
            </ol>
            <p>This data was updated on 2020-04-12. If Something seems incorrect, contact our
                <span className={css(styles.supportLink)}>&nbsp;
                <Link
                        to='/contact'
                        className={css(styles.routeLink)}
                    >
                        Support Team.
                </Link>
                </span></p>
        </div>
    )
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
