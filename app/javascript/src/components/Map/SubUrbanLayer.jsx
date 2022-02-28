import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLeaflet } from 'react-leaflet'
import L from 'leaflet'
import SubUrbanLegendContent from './SubUrbanLegendContent'
import { getHexColor } from '../../utils/helpers'

function geoJSONStyle(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: '#A8A8A8',
    dashArray: "3",
    fillOpacity: 0.7,
    fillColor: getHexColor(feature && Number(feature.properties.estimated_population))
  }
}

export default function SubUrbanLayer({ data }){
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
        `<h6>Sub-urban Legend</h6>${ 
        props
          ? `<b>${String(props.sub_urban)}`
          : 'Hover over a Sub-urban area'}`
    };

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

     /* eslint-disable no-unused-expressions */
    /* istanbul ignore next */
    map?.on('overlayadd', function(layer){
      if(layer?.name === 'Sub-urban Areas'){
        geojson = L.geoJson(data, {
          style: geoJSONStyle,
          onEachFeature
        })?.addTo(map)

        info.addTo(map);
      }
    })
    
      /* eslint-disable no-unused-expressions */
      /* istanbul ignore next */
    map?.on('overlayremove', function(layer){
      if(layer?.name === 'Sub-urban Areas'){
        map?.removeControl(geojson);
        map?.removeControl(info);
      }
    })
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

SubUrbanLayer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
}