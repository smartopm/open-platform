// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { useLeaflet } from 'react-leaflet'
import L from 'leaflet'
import LandParcelLegendContent from './LandParcelLegendContent'

export default function LandParcelLegend(){
  const { map } = useLeaflet()

   useEffect(() => {
    const legend = L.control({ position: 'topright' })

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend')
      div.innerHTML = renderToString(<LandParcelLegendContent />)
      return div
    }

    legend.addTo(map);

    return () => legend.remove() // cleanup
  }, [map])

  return null
}

