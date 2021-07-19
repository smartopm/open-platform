// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { useLeaflet } from 'react-leaflet'
import L from 'leaflet'
import LandParcelLegendContent from './LandParcelLegendContent'

export default function LandParcelLegend(){
  const { map } = useLeaflet()

   useEffect(() => {
    const landParcelLegend = L.control({ position: 'topright' })

    landParcelLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'landParcelLegend')
      div.innerHTML = renderToString(<LandParcelLegendContent />)
      return div
    }

      /* istanbul ignore next */
      /* eslint-disable no-unused-expressions */
    map?.on('overlayadd', function(layer){
      if(layer?.name === 'Land Parcels'){
        landParcelLegend.addTo(map);
      }
    })
    
      /* istanbul ignore next */
      /* eslint-disable no-unused-expressions */
    map?.on('overlayremove', function(layer){
      if(layer?.name === 'Land Parcels'){
        map?.removeControl(landParcelLegend);
      }
    })


    return () => landParcelLegend.remove() // cleanup
  }, [map])

  return null
}

