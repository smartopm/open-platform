import React, { useEffect } from 'react'
import { useLeaflet } from 'react-leaflet'
import L from 'leaflet'
import NkwashiSuburbBoundaryData from '../../data/nkwashi_suburb_boundary.json'
import SubUrbanLegendContent from './SubUrbanLegendContent'
import { getHexColor } from '../../utils/helpers'

function geoJSONStyle(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
    fillColor: getHexColor(feature && Number(feature.properties.estimated_population))
  }
}

export default function SubUrbanLayer(){
  const { map } = useLeaflet()

  /* istanbul ignore next */
  useEffect(() => {
    // Used to manage control on the map
    const info = L.control()

    info.onAdd = () => {
      info.div = L.DomUtil.create('div', 'info')
      info.update()
      return info.div
    };

    /* istanbul ignore next */
    /* eslint-disable react/prop-types */
    info.update = function(props){
      info.div.innerHTML =
        `<h5>Est. Population Census/Nkwashi Sub-urban</h5>
        <p>Index: 1 Plot == 1 Building == 1 Household </p>${ 
        props
          ? `<b>${ 
            props.sub_urban 
            }</b><br />${ 
            Number(props.estimated_population)
            } people / mi<sup>2</sup>`
          : 'Hover over a Sub-urban area'}`
    };

    info.addTo(map)

    /* istanbul ignore next */
    const highlightFeature = function(e) {
      const layer = e.target;

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      })

      info.update(layer.feature.properties)
    };

    let geojson

    /* istanbul ignore next */
    const resetHighlight = function(e) {
      geojson.resetStyle(e.target)
      info.update()
    };

    /* istanbul ignore next */
    const zoomToFeature = function(e) {
      map.fitBounds(e.target.getBounds())
    };

    /* istanbul ignore next */
    const onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      })
    }

    geojson = L.geoJson(NkwashiSuburbBoundaryData, {
      style: geoJSONStyle,
      onEachFeature
    })?.addTo(map)
  }, [map])

  return (
    <>
      <style
         // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
        .info {
        padding: 6px 8px;
        font: 14px/16px Arial, Helvetica, sans-serif;
        background: white;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        margin-left: 70px;
      }

      .info h5 {
        margin: 0 0 5px;
        color: #777;
      }

      .legend {
        text-align: left;
        line-height: 18px;
        color: #555;
      }

      .legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
      }
      `
        }}
      />
      <SubUrbanLegendContent />
    </>
    )
}