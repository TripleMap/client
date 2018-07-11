import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';
import numeral from 'numeral';
import * as polylabel from 'polylabel';
import { MapService } from './MapService';

export const MEASURE_STYLES = [
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
    'id': "tdmap-draw-measure-while-draw-polylyne-label",
    'type': "symbol",
    'filter': ["==", "meta", "measureLineCurrentPosition"],
    'layout': {
      "text-field": "{langth}",
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
  }, {
    'id': "tdmap-draw-measure-while-draw-polygon-label",
    'type': "symbol",
    'filter': ["==", "meta", "measurePolygonCurrentPosition"],
    'layout': {
      "text-field": "{length} \n {area}",
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


const getDisplayLengthMeasurements = (coordinates) => turf.length(turf.lineString(coordinates)) * 1000;
const getDisplaySquareMeasurements = (coordinates) => turf.area(turf.polygon(coordinates));
const readableDistance = (length) => (length >= 1000) ? `${numeral(length / 1000).format('0.00')} км` : `${numeral(length).format('0,0')} м`;
const readableArea = (area) => (area >= 1000000) ? `${numeral(area / 1000000).format('0.00')} км2` : (area >= 10000) ? `${numeral(area / 10000).format('0.00')} Га` : `${numeral(area).format('0,0')} м2`;
const centerOfMass = (coordinates) => polylabel(coordinates);


const MeasureLineStringMode = Object.assign({}, MapboxDraw.modes.draw_line_string);

MeasureLineStringMode.toDisplayFeatures = function (state, geojson, display) {
  MapboxDraw.modes.draw_line_string.toDisplayFeatures.call(this, state, geojson, display);
  if (geojson.geometry.coordinates.length > 1) {
    const currentVertex: any = {
      type: 'Feature',
      properties: {
        meta: 'measureLineCurrentPosition',
        langth: readableDistance(getDisplayLengthMeasurements(geojson.geometry.coordinates)),
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

const MeasurePolygonMode = Object.assign({}, MapboxDraw.modes.draw_polygon);

MeasurePolygonMode.toDisplayFeatures = function (state, geojson, display) {
  MapboxDraw.modes.draw_polygon.toDisplayFeatures.call(this, state, geojson, display);
  if (geojson.geometry.coordinates[0].length >= 4) {
    const currentVertex: any = {
      type: 'Feature',
      properties: {
        meta: 'measurePolygonCurrentPosition',
        length: readableDistance(getDisplayLengthMeasurements(geojson.geometry.coordinates[0])),
        area: readableArea(getDisplaySquareMeasurements(geojson.geometry.coordinates)),
        parent: state.polygon.id
      },
      geometry: {
        type: 'Point',
        coordinates: geojson.geometry.coordinates[0][geojson.geometry.coordinates[0].length - 2],
      },
    };
    display(currentVertex);
  }
}
















@Injectable({
  providedIn: 'root'
})
export class MeasureService {
  public labelGeoJSONHolder: any = {
    type: 'FeatureCollection',
    features: []
  };
  private editor: any;

  constructor(private MapService: MapService) { }

  public modes = () => ({ measure_line: MeasureLineStringMode, measure_polygon: MeasurePolygonMode });

  public initialyze(editor) {
    this.editor = editor;
    this.createEndedLabelLayer();
    const map = this.MapService.getMap();
    map.on('draw.direct_select.drag.start', (e) => {
      this.removeFeatureFromLabelLayer(e);
      map.once('draw.direct_select.drag.stop', (e) => this.updateFeatureFromLabelLayer(e));
    });
    map.on('draw.create', (e) => this.addFeatureToLabelLayer(e));
  }

  public stopMeasure() {
    this.labelGeoJSONHolder.features = [];
    this.MapService.getMap().getSource(`measure-label-features`).setData(this.labelGeoJSONHolder);
  }

  public removeLayers() {
    const ids = this.labelGeoJSONHolder.features.map(feature => feature.properties.id);
    this.editor.delete(ids);
  }

  private createEndedLabelLayer() {
    const LineStringLayerOptions = {
      'id': `measure-label-linestring-features`,
      'source': `measure-label-features`,
      'filter': ['all', ["==", "measureType", 'LineString']],
      'type': 'symbol',
      'layout': {
        "text-field": "{length}",
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
    };

    const PolygonLayerOptions = {
      'id': `measure-label-polygon-features`,
      'source': `measure-label-features`,
      'filter': ['all', ["==", "measureType", 'Polygon']],
      'type': 'symbol',
      'layout': {
        "text-field": "{length} \n {area}",
        "text-anchor": "center",
        "text-offset": [0, 0],
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
    };

    const map = this.MapService.getMap();
    map.addSource(`measure-label-features`, { type: 'geojson', data: null });
    map.addLayer(LineStringLayerOptions);
    map.addLayer(PolygonLayerOptions);
  }


  private createLabelPointFromLineString = (feature) => ({
    type: 'Feature',
    properties: {
      measureType: 'LineString',
      id: feature.id,
      length: readableDistance(getDisplayLengthMeasurements(feature.geometry.coordinates))
    },
    geometry: {
      type: 'Point',
      coordinates: feature.geometry.coordinates[feature.geometry.coordinates.length - 1]
    }
  })

  private createLabelPointFromPolygon = (feature) => ({
    type: 'Feature',
    properties: {
      measureType: 'Polygon',
      id: feature.id,
      length: readableDistance(getDisplayLengthMeasurements(feature.geometry.coordinates[0])),
      area: readableArea(getDisplaySquareMeasurements(feature.geometry.coordinates))
    },
    geometry: {
      type: 'Point',
      coordinates: centerOfMass(feature.geometry.coordinates)
    }
  })

  private addFeatureToLabelLayer(e) {
    if (this.editor.getMode() === 'measure_line' || this.editor.getMode() === 'measure_polygon') {
      const map = this.MapService.getMap();
      const feature = e.features[0];

      if (!feature) return;
      let point;
      if (feature.geometry.type === 'LineString') {
        point = this.createLabelPointFromLineString(feature);
      } else if (feature.geometry.type === 'Polygon') {
        point = this.createLabelPointFromPolygon(feature);
      }

      let isAdded = this.labelGeoJSONHolder.features.map(feature => feature.properties.id).indexOf(point.properties.id) !== -1;
      if (isAdded) {
        this.labelGeoJSONHolder.features = this.labelGeoJSONHolder.features.filter(feature => feature.properties.id === point.properties.id ? false : feature);
      }
      this.labelGeoJSONHolder.features.push(point);
      map.getSource(`measure-label-features`).setData(this.labelGeoJSONHolder);
    }
  }

  private updateFeatureFromLabelLayer(e) {
    if (e.drawClient !== "measure") return;
    const feature = e.features[0];
    if (!feature) return;
    const map = this.MapService.getMap();
    let point;
    if (feature.geometry.type === 'LineString') {
      point = this.createLabelPointFromLineString(feature);
    } else if (feature.geometry.type === 'Polygon') {
      point = this.createLabelPointFromPolygon(feature);
    }
    let isAdded = this.labelGeoJSONHolder.features.map(feature => feature.properties.id).indexOf(point.properties.id) !== -1;
    if (isAdded) {
      this.labelGeoJSONHolder.features = this.labelGeoJSONHolder.features.filter(feature => feature.properties.id === point.properties.id ? false : feature);
    }
    this.labelGeoJSONHolder.features.push(point);
    map.getSource(`measure-label-features`).setData(this.labelGeoJSONHolder);
  }

  private removeFeatureFromLabelLayer(e) {
    const map = this.MapService.getMap();
    if (e.features[0]) {
      let isAdded = this.labelGeoJSONHolder.features.map(feature => feature.properties.id).indexOf(e.features[0].id) !== -1;
      if (isAdded) {
        this.labelGeoJSONHolder.features = this.labelGeoJSONHolder.features.filter(feature => feature.properties.id === e.features[0].id ? false : feature);
      }
      map.getSource(`measure-label-features`).setData(this.labelGeoJSONHolder);
    }
  }
}
