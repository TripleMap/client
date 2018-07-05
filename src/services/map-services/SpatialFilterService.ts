import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';
import numeral from 'numeral';
import * as polylabel from 'polylabel';

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

const createGeoJSONCircle = (center, radiusInKm, parentId, points = 64) => {
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

SpatialFilterRadiusMode.toDisplayFeatures = function (state, geojson, display) {
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
        radius: (getDisplayLengthMeasurements(lineGeoJson.geometry.coordinates)).toFixed(1),
      },
    };

    this.map.fire('draw.create', {
      features: [pointWithRadius],
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
      langth: readableDistance(getDisplayLengthMeasurements(geojson.geometry.coordinates)),
      parent: state.line.id
    },
    geometry: {
      type: 'Point',
      coordinates: geojson.geometry.coordinates[geojson.geometry.coordinates.length - 1],
    },
  };
  display(currentVertex);



  const center = geojson.geometry.coordinates[0];
  const radiusInKm = getDisplayLengthMeasurements(geojson.geometry.coordinates);
  const circleFeature = createGeoJSONCircle(center, radiusInKm, state.line.id);
  circleFeature.properties.meta = 'radius';
  display(circleFeature);

  return null;
};


const SpatialFilterPolygonMode = Object.assign({}, MapboxDraw.modes.draw_polygon);




@Injectable({
  providedIn: 'root'
})
export class SpatialFilterService {

  constructor() { }
  public modes = () => ({ spatial_filter_radius_mode: SpatialFilterRadiusMode })
}
