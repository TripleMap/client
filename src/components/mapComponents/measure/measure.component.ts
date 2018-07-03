import { Component } from "@angular/core";
import { MapService } from '../../../services/map-services/MapService';
import * as turf from '@turf/turf';

import numeral from 'numeral';
const MAPBOX_DRAW_STYLES = [
  {
    'id': 'tdmap-draw-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'fill-color': '#008CE5',
      'fill-outline-color': '#008CE5',
      'fill-opacity': 0.1
    }
  }, {
    'id': 'tdmap-draw-polygon-fill-active',
    'type': 'fill',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#008CE5',
      'fill-outline-color': '#008CE5',
      'fill-opacity': 0.1
    }
  }, {
    'id': 'tdmap-draw-polygon-midpoint',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#008CE5'
    }
  }, {
    'id': 'tdmap-draw-polygon-stroke-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#008CE5',
      'line-width': 3
    },

  }, {
    'id': 'tdmap-draw-polygon-stroke-active',
    'type': 'line',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#008CE5',
      'line-dasharray': [0.2, 2],
      'line-width': 3
    },
  }, {
    'id': 'tdmap-draw-line-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#008CE5',
      'line-width': 3
    },

  }, {
    'id': 'tdmap-draw-line-active',
    'type': 'line',
    'filter': ['all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#008CE5',
      'line-dasharray': [0.2, 2],
      'line-width': 3
    },

  }, {
    'id': 'tdmap-draw-polygon-and-line-vertex-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  }, {
    'id': 'tdmap-draw-polygon-and-line-vertex-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#008CE5'
    }
  }, {
    'id': 'tdmap-draw-point-point-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#fff'
    }
  }, {
    'id': 'tdmap-draw-point-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#008CE5'
    }
  }, {
    'id': 'tdmap-draw-point-stroke-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['!=', 'meta', 'midpoint']
    ],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#fff'
    }
  }, {
    'id': 'tdmap-draw-point-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#008CE5'
    }
  }, {
    'id': 'tdmap-draw-polygon-fill-static',
    'type': 'fill',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#008CE5',
      'fill-outline-color': '#008CE5',
      'fill-opacity': 0.1
    }
  }, {
    'id': 'tdmap-draw-polygon-stroke-static',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#008CE5',
      'line-width': 2
    },

  }, {
    'id': 'tdmap-draw-line-static',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#008CE5',
      'line-width': 3
    },
  }, {
    'id': 'tdmap-draw-point-static',
    'type': 'circle',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#008CE5'
    }
  }, {
    'id': "tdmap-draw-measure-while-draw-label",
    'type': "symbol",
    'filter': ["==", "meta", "currentPosition"],
    'layout': {
      "text-field": "{mouseOverMetric}",
      "text-anchor": "left",
      "text-offset": [1, -1],
      "text-size": 14,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    },
    'paint': {
      "text-color": "#2952c2",
      "text-halo-color": "#fff",
      "text-halo-width": 2,
      "icon-opacity": {
        'base': 1,
        'stops': [[7.99, 1], [8, 0]]
      },
      "text-halo-blur": 1
    }
  }
];




const getDisplayMeasurements = (coordinates) => {
  const line: any = turf.lineString(coordinates);
  const drawnLength = turf.length(line) * 1000;
  let metricUnits = 'м';
  let metricFormat = '0,0';
  let metricMeasurement;

  metricMeasurement = drawnLength;
  if (drawnLength >= 1000) { // if over 1000 meters, upgrade metric
    metricMeasurement = drawnLength / 1000;
    metricUnits = 'км';
    metricFormat = '0.00';
  }

  return `${numeral(metricMeasurement).format(metricFormat)} ${metricUnits}`;
}


const MeasureLineStringMode = Object.assign({}, MapboxDraw.modes.draw_line_string);

MeasureLineStringMode.toDisplayFeatures = function (state, geojson, display) {

  MapboxDraw.modes.draw_line_string.toDisplayFeatures.call(this, state, geojson, display);

  if (geojson.geometry.coordinates.length > 1) {
    const currentVertex: any = {
      type: 'Feature',
      properties: {
        meta: 'currentPosition',
        mouseOverMetric: getDisplayMeasurements(geojson.geometry.coordinates),
        parent: state.line.id
      },
      geometry: {
        type: 'Point',
        coordinates: geojson.geometry.coordinates[geojson.geometry.coordinates.length - 1],
      },
    };
    display(currentVertex);
  }
}


@Component({
  selector: "measure-controls",
  templateUrl: "./measure.component.html",
  styleUrls: ["./measure.component.css"]
})
export class MeasureComponent {
  public isActive = false;
  public measureToolsIsActive = false;
  public measureTools: any;
  public labelGeoJSONHolder: any = {
    type: 'FeatureCollection',
    features: []
  };
  constructor(
    public MapService: MapService
  ) {
    this.MapService.mapReady.subscribe(ready => {
      if (!ready) return;
      const map = this.MapService.getMap()
      const draw = new MapboxDraw({
        styles: MAPBOX_DRAW_STYLES,
        modes: Object.assign({ measure_line: MeasureLineStringMode, }, MapboxDraw.modes),
      });
      map.addControl(draw, 'top-left');
      this.measureTools = draw;
      this.createEndedLabelLayer();
      map.on('draw.update', (e) => {
        console.log('draw.update', e)
        this.updateFeatureFromLabelLayer(e);
      });
      map.on('move', (e) => {
        console.log('draw.selectionchange', e)
        // this.removeFeatureFromLabelLayer(e);
      });
      map.on('draw.create', (e) => {
        console.log('draw.create', e)
        this.addFeatureToLabelLayer(e);
      });

      MapboxDraw.modes.direct_select = function (state, e) {
        MapboxDraw.modes.direct_select.call(MapboxDraw.modes.direct_select, state, e)
        MapboxDraw.modes.direct_select.map.fire('Constants.events.UPDATE', {
          action: 'Constants.events.UPDATE',
          features: MapboxDraw.modes.direct_select.getSelected().map(f => f.toGeoJSON())
        });
      }
      console.log(this.measureTools)
    });
  }


  showMeasureTools = () => (this.isActive = !this.isActive);
  startPolylineMeasure() {
    this.measureTools = this.measureTools.changeMode('measure_line');
    this.measureToolsIsActive = true;
  }

  startPolygonMeasure() {
    this.measureTools = this.measureTools.changeMode('draw_polygon');
    this.measureToolsIsActive = true;
  }

  stopMeasure() {
    if (this.measureTools) {
      this.measureTools.deleteAll();
    }
    this.measureToolsIsActive = false;
  }

  createEndedLabelLayer() {

    const layerOptions = {
      'id': `measure-label-features`,
      'source': `measure-label-features`,
      'type': 'symbol',
      'layout': {
        "text-field": "{measurement}",
        "text-anchor": "left",
        "text-offset": [1, -1],
        "text-size": 14,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      },
      'paint': {
        "text-color": "#2952c2",
        "text-halo-color": "#fff",
        "text-halo-width": 2,
        "icon-opacity": {
          'base': 1,
          'stops': [[7.99, 1], [8, 0]]
        },
        "text-halo-blur": 1
      }
    }
    const map = this.MapService.getMap();

    map.addSource(`measure-label-features`, {
      type: 'geojson',
      data: null,
      maxzoom: 24,
    });

    map.addLayer(layerOptions);
  }


  createLabelPointFromLineString = (feature) => ({
    type: 'Feature',
    properties: {
      id: feature.id,
      measurement: getDisplayMeasurements(feature.geometry.coordinates)
    },
    geometry: {
      type: 'Point',
      coordinates: feature.geometry.coordinates[feature.geometry.coordinates.length - 1]
    }
  })


  addFeatureToLabelLayer(e) {
    const map = this.MapService.getMap();
    const point = this.createLabelPointFromLineString(e.features[0])
    let isAdded = this.labelGeoJSONHolder.features.map(feature => feature.properties.id).indexOf(point.properties.id) !== -1;
    if (isAdded) {
      this.labelGeoJSONHolder.features = this.labelGeoJSONHolder.features.filter(feature => feature.properties.id === point.properties.id ? false : feature);
    }
    this.labelGeoJSONHolder.features.push(point);
    map.getSource(`measure-label-features`).setData(this.labelGeoJSONHolder);
  }

  updateFeatureFromLabelLayer(e) {
    const map = this.MapService.getMap();
    const point = this.createLabelPointFromLineString(e.features[0])
    let isAdded = this.labelGeoJSONHolder.features.map(feature => feature.properties.id).indexOf(point.properties.id) !== -1;
    if (isAdded) {
      this.labelGeoJSONHolder.features = this.labelGeoJSONHolder.features.filter(feature => feature.properties.id === point.properties.id ? false : feature);
    }
    this.labelGeoJSONHolder.features.push(point);
    map.getSource(`measure-label-features`).setData(this.labelGeoJSONHolder);
  }

  removeFeatureFromLabelLayer(e) {
    const map = this.MapService.getMap();
    if (e.features[0]) {
      const point = this.createLabelPointFromLineString(e.features[0])
      let isAdded = this.labelGeoJSONHolder.features.map(feature => feature.properties.id).indexOf(point.properties.id) !== -1;
      if (isAdded) {
        this.labelGeoJSONHolder.features = this.labelGeoJSONHolder.features.filter(feature => feature.properties.id === point.properties.id ? false : feature);
      }
      map.getSource(`measure-label-features`).setData(this.labelGeoJSONHolder);
    }
  }
}
