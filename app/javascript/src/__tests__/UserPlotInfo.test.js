import React from 'react';
import { UserPlotInfo } from '../components/UserPlotInfo';
import { BrowserRouter } from 'react-router-dom';
import {
    cleanup,
    render
} from '@testing-library/react'


describe('User Plot Info Page', () => {

    const accounts = [{
        id: "2dc81-48ab-9afc",
        updatedAt: "2020-05-15T17:09:37Z",
        landParcels: [{
            id: "6f1f-4200-8cqa",
            parcelNumber: "Standard434"
        },
        {
            id: "6f1f-4200-8cea",
            parcelNumber: "Standard485"
        }]
    }, {
        id: "2d81-48ab-9p8c",
        updatedAt: "2020-05-20T17:09:37Z",
        landParcels: [{
            id: "6f1f-4200-8jfa",
            parcelNumber: "Standard456"
        }]
    }]

    it('Component should display all parcel numbers', () => {
        let numberOfPlots = accounts.reduce((sum, account) => {
            return account.landParcels.length + sum
        }, 0);
        const { getByTestId } = render(<BrowserRouter><UserPlotInfo accounts={accounts} /></BrowserRouter>)
        const ol = getByTestId('pn');
        expect(ol.children.length).toBe(numberOfPlots);
    });

    afterEach(cleanup)
});

