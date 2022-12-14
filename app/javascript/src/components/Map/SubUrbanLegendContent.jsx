// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import { useLeaflet } from 'react-leaflet'
import L from 'leaflet'
import { getHexColor, objectAccessor } from '../../utils/helpers'

/* istanbul ignore next */
/* eslint-disable no-unused-expressions */
export default function SubUrbanLegendContent(){
  const { map } = useLeaflet()

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' })

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend')
      const grades = [0, 20, 120, 170, 220, 270, 320]
      const labels = []
      let from
      let to

      grades.forEach((element, index) => {
        from = element
        to = objectAccessor(grades, index + 1)

        labels.push(
          `<i style="background:${getHexColor(from + 1)}"></i>${from}${to ? `&ndash;${  to}` : '+'}`
        )
      });

      div.innerHTML = labels.join('<br>')
      return div
    }

     map?.on('overlayadd', function(layer){
      if(layer?.name === 'Sub-urban Areas'){
        legend.addTo(map);
      }
    })

    map?.on('overlayremove', function(layer){
      if(layer?.name === 'Sub-urban Areas'){
        map?.removeControl(legend);
      }
    })
  }, [map])

  return null
}