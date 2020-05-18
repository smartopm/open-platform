import React from 'react';
import { ClientPlotInfo } from '../components/ClientPlotInfo';
import {
    cleanup,
    fireEvent,
    render
} from '@testing-library/react'


describe('Client Plot Info Page', () => {

    const accounts = [{
        id: "2dc81-48ab-9afc",
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
        landParcels: [{
            id: "6f1f-4200-8jfa",
            parcelNumber: "Standard456"
        }]
    }]


    it('render without error', () => {
        render(<ClientPlotInfo />)
    });


    it('clicks button and opens use window', () => {

        const { getByTestId } = render(<ClientPlotInfo accounts={accounts} />)
        const ol = getByTestId('pn');
        expect(ol.children.length).toBe(3)
    });

    afterEach(cleanup)
});

