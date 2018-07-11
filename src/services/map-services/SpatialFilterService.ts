import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';
import numeral from 'numeral';
import * as polylabel from 'polylabel';
import { MapService } from './MapService';

export const SPATIAL_FILTER_STYLES = [
  {
    'id': 'tdmap-draw-spatial-filter-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'fill-color': '#ff6d00',
      'fill-outline-color': '#ff6d00',
      'fill-opacity': 0.1
    }
  }, {
    'id': 'tdmap-draw-spatial-filter-polygon-fill-active',
    'type': 'fill',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#ff6d00',
      'fill-outline-color': '#ff6d00',
      'fill-opacity': 0.1
    }
  }, {
    'id': 'tdmap-draw-spatial-filter-polygon-midpoint',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#ff6d00'
    }
  }, {
    'id': 'tdmap-draw-spatial-filter-polygon-stroke-inactive',
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
      'line-color': '#ff6d00',
      'line-width': 3
    },

  }, {
    'id': 'tdmap-draw-spatial-filter-polygon-stroke-active',
    'type': 'line',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#ff6d00',
      'line-dasharray': [0.2, 2],
      'line-width': 3
    },
  }, {
    'id': 'tdmap-draw-spatial-filter-line-inactive',
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
      'line-color': '#ff6d00',
      'line-width': 3
    },

  }, {
    'id': 'tdmap-draw-spatial-filter-line-active',
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
      'line-color': '#ff6d00',
      'line-dasharray': [0.2, 2],
      'line-width': 3
    },

  }, {
    'id': 'tdmap-draw-spatial-filter-polygon-and-line-vertex-stroke-inactive',
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
    'id': 'tdmap-draw-spatial-filter-polygon-and-line-vertex-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#ff6d00'
    }
  }, {
    'id': 'tdmap-draw-spatial-filter-point-point-stroke-inactive',
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
    'id': 'tdmap-draw-spatial-filter-point-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#ff6d00'
    }
  }, {
    'id': 'tdmap-draw-spatial-filter-point-stroke-active',
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
    'id': 'tdmap-draw-spatial-filter-point-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#ff6d00'
    }
  }, {
    'id': 'tdmap-draw-spatial-filter-polygon-fill-static',
    'type': 'fill',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#ff6d00',
      'fill-outline-color': '#ff6d00',
      'fill-opacity': 0.1
    }
  }, {
    'id': 'tdmap-draw-spatial-filter-polygon-stroke-static',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#ff6d00',
      'line-width': 2
    },

  }, {
    'id': 'tdmap-draw-spatial-filter-line-static',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#ff6d00',
      'line-width': 3
    },
  }, {
    'id': 'tdmap-draw-spatial-filter-point-static',
    'type': 'circle',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#ff6d00'
    }
  }, {
    'id': "tdmap-draw-spatial-filter-while-draw-point-label",
    'type': "symbol",
    'filter': ["==", "meta", "spatialFilterRadiusCurrentPosition"],
    'layout': {
      "text-field": "{radius}",
      "text-anchor": "left",
      "text-offset": [1, -1],
      "text-size": 14,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    },
    'paint': {
      "text-color": "#ff6d00",
      "text-halo-color": "#fff",
      "text-halo-width": 2,
      "icon-opacity": {
        'base': 1,
        'stops': [[7.99, 1], [8, 0]]
      },
      "text-halo-blur": 1
    }
  }, {
    'id': "tdmap-draw-spatial-filter-draw-end-point-label",
    'type': "symbol",
    'filter': ["==", "type", "endedPoint"],
    'layout': {
      "text-field": "{radius}",
      "text-anchor": "left",
      "text-offset": [1, -1],
      "text-size": 14,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    },
    'paint': {
      "text-color": "#ff6d00",
      "text-halo-color": "#fff",
      "text-halo-width": 2,
      "icon-opacity": {
        'base': 1,
        'stops': [[7.99, 1], [8, 0]]
      },
      "text-halo-blur": 1
    }
  }, {
    'id': "tdmap-draw-spatial-filter-while-draw-polygon-label",
    'type': "fill",
    'filter': ["==", "meta", "spatialFilterRadiusPolygon"],
    'paint': {
      'fill-color': '#ff6d00',
      'fill-opacity': 0.2,
      'fill-outline-color': '#ff6d00'
    },
  }
];



const getDisplayLengthMeasurements = (coordinates) => turf.length(turf.lineString(coordinates)) * 1000;
const getDisplaySquareMeasurements = (coordinates) => turf.area(turf.polygon(coordinates));
const readableDistance = (length) => (length >= 1000) ? `${numeral(length / 1000).format('0.00')} км` : `${numeral(length).format('0,0')} м`;
const readableArea = (area) => (area >= 1000000) ? `${numeral(area / 1000000).format('0.00')} км2` : (area >= 10000) ? `${numeral(area / 10000).format('0.00')} Га` : `${numeral(area).format('0,0')} м2`;
const centerOfMass = (coordinates) => polylabel(coordinates);




const createVertex = (parentId, coordinates, path, selected) => ({
  type: 'Feature',
  properties: {
    meta: 'vertex',
    parent: parentId,
    coord_path: path,
    active: (selected) ? 'true' : 'false',
  },
  geometry: {
    type: 'Point',
    coordinates,
  }
})

const createGeoJSONCircle = (center, radiusInKm, parentId, points = 180) => {
  const coords = {
    latitude: center[1],
    longitude: center[0],
  };

  const km = radiusInKm;

  const ret = [];
  const distanceX = km / (111.320 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  let theta;
  let x;
  let y;
  for (let i = 0; i < points; i += 1) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);

    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ret],
    },
    properties: {
      parent: parentId,
      meta: null
    },
  };
}


const doubleClickZoom = {
  enable: (ctx) => {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },
};


const SpatialFilterRadiusMode = Object.assign({}, MapboxDraw.modes.draw_line_string);

SpatialFilterRadiusMode.clickAnywhere = function (state, e) {
  if (state.currentVertexPosition === 1) {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
    return this.changeMode('simple_select', { featureIds: [state.line.id] });
  }
  this.updateUIClasses({ mouse: 'add' });
  state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
  if (state.direction === 'forward') {
    state.currentVertexPosition += 1;
    state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
  } else {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
  }

  return null;
};

SpatialFilterRadiusMode.onStop = function (state) {
  doubleClickZoom.enable(this);
  this.activateUIButton();
  if (this.getFeature(state.line.id) === undefined) return;
  state.line.removeCoordinate('0');
  if (state.line.isValid()) {

    const lineGeoJson = state.line.toGeoJSON();
    const pointWithRadius = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: lineGeoJson.geometry.coordinates[0],
      },
      properties: {
        radius: (getDisplayLengthMeasurements(lineGeoJson.geometry.coordinates)),
      },
    };

    const EndedPointWithRadius = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: lineGeoJson.geometry.coordinates[1],
      },
      properties: {
        radius: (getDisplayLengthMeasurements(lineGeoJson.geometry.coordinates)),
      },
    };


    const center = lineGeoJson.geometry.coordinates[0];
    const radiusInKm = getDisplayLengthMeasurements(lineGeoJson.geometry.coordinates) / 1000;
    const circleFeature = createGeoJSONCircle(center, radiusInKm, state.line.id);
    circleFeature.properties.meta = 'spatialFilterRadiusPolygon';
    state.polygon = circleFeature;


    this.map.fire('draw.create', {
      features: [pointWithRadius, EndedPointWithRadius, circleFeature],
    });
  } else {
    this.deleteFeature([state.line.id], { silent: true });
    this.changeMode('simple_select', {}, { silent: true });
  }
};

SpatialFilterRadiusMode.toDisplayFeatures = function (state, geojson, display) {
  const isActiveLine = geojson.properties.id === state.line.id;
  geojson.properties.active = (isActiveLine) ? 'true' : 'false';
  if (!isActiveLine) return display(geojson);
  if (geojson.geometry.coordinates.length < 2) return null;
  geojson.properties.meta = 'feature';
  display(createVertex(
    state.line.id,
    geojson.geometry.coordinates[state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1],
    `${state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1}`,
    false,
  ));

  display(geojson);

  const currentVertex: any = {
    type: 'Feature',
    properties: {
      meta: 'spatialFilterRadiusCurrentPosition',
      radius: readableDistance(getDisplayLengthMeasurements(geojson.geometry.coordinates)),
      parent: state.line.id
    },
    geometry: {
      type: 'Point',
      coordinates: geojson.geometry.coordinates[geojson.geometry.coordinates.length - 1],
    },
  };
  display(currentVertex);



  const center = geojson.geometry.coordinates[0];
  const radiusInKm = getDisplayLengthMeasurements(geojson.geometry.coordinates) / 1000;
  const circleFeature = createGeoJSONCircle(center, radiusInKm, state.line.id);
  circleFeature.properties.meta = 'spatialFilterRadiusPolygon';
  display(circleFeature);

  return null;
};


const SpatialFilterPolygonMode = Object.assign({}, MapboxDraw.modes.draw_polygon);




@Injectable({
  providedIn: 'root'
})
export class SpatialFilterService {
  private editor: any;
  public featureId: string;
  constructor(public MapService: MapService) { }
  public modes = () => ({ spatial_filter_radius_mode: SpatialFilterRadiusMode })


  public initialyze(editor) {
    this.editor = editor;
    const map = this.MapService.getMap();
    map.on('draw.direct_select.drag.start', (e) => {
      console.log(e)
      // map.once('draw.direct_select.drag.stop', (e) => this.updateFeatureFromLabelLayer(e));
    });
    map.on('draw.create', (e) => this.addFeatureToLabelLayer(e));
    this.createRadiusLayer();
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

  private createRadiusLayer() {
    const radiusLayerOptions = {
      'id': `spatial-filter-radius-features`,
      'source': `spatial-filter-radius-features`,
      'filter': ['all', ["==", "meta", "spatialFilterRadiusPolygon"]],
      'type': 'fill',
      'paint': {
        'fill-color': '#ff6d00',
        'fill-opacity': 0.2,
        'fill-outline-color': '#ff6d00'
      }
    };

    const radiusLabelLayerOptions = {
      'id': `spatial-filter-label-linestring-features`,
      'source': `spatial-filter-radius-features`,
      'filter': ['all', ["==", "meta", 'spatialFilterRadiusPoint']],
      'type': 'symbol',
      'layout': {
        "text-field": "{radius}",
        "text-anchor": "left",
        "text-offset": [1, -1],
        "text-size": 14,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      },
      'paint': {
        "text-color": "#ff6d00",
        "text-halo-color": "#fff",
        "text-halo-width": 2,
        "icon-opacity": {
          'base': 1,
          'stops': [[7.99, 1], [8, 0]]
        },
        "text-halo-blur": 1
      }
    };

    const radiusEndPointLayerOptionsHalo = {
      'id': 'spatial-filter-label-end-point-features-halo',
      'type': 'circle',
      'source': `spatial-filter-radius-features`,
      'filter': ['==', '$type', 'Point'],
      'paint': {
        'circle-radius': 7,
        'circle-color': '#fff'
      }
    }
    const radiusEndPointLayerOptions = {
      'id': 'spatial-filter-label-end-point-features',
      'type': 'circle',
      'source': `spatial-filter-radius-features`,
      'filter': ['==', '$type', 'Point'],
      'paint': {
        'circle-radius': 5,
        'circle-color': '#ff6d00'
      }
    };

    const map = this.MapService.getMap();
    map.addSource(`spatial-filter-radius-features`, { type: 'geojson', data: null });
    map.addLayer(radiusLayerOptions);
    map.addLayer(radiusLabelLayerOptions);
    map.addLayer(radiusEndPointLayerOptionsHalo);
    map.addLayer(radiusEndPointLayerOptions);

  }
  private addFeatureToLabelLayer(e) {
    if (this.editor.getMode() === 'spatial_filter_radius_mode') {
      const map = this.MapService.getMap();
      const featureToLabel = e.features[1];
      featureToLabel.properties.meta = 'spatialFilterRadiusPoint';
      featureToLabel.properties.radius = readableDistance(featureToLabel.properties.radius);

      const radiusFeature = e.features[2];
      if (this.featureId) this.editor.delete(this.featureId);
      if (!radiusFeature) return;

      this.featureId = radiusFeature.properties.parent;
      let featureCollection = {
        type: 'FeatureCollection',
        features: []
      }
      featureCollection.features.push(radiusFeature);
      featureCollection.features.push(featureToLabel);

      map.getSource(`spatial-filter-radius-features`).setData(featureCollection);
    }
  }
}
