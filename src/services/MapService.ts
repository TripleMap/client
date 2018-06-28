import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as mapboxgl from 'mapbox-gl';

@Injectable()
export class MapService {
    public map: any;
    public mapReady = new BehaviorSubject<any>(false);
    getMap = () => this.map;

    constructor() { }

    mapInvalidateSize = () => {
        if (!this.map) return;
        setTimeout(() => {
            this.map.resize();
        }, 300);
    }

    createMap(mapElementId) {
        let zoom, lat, lng;

        const zoomState = window.localStorage.getItem("MAP_STATE_ZOOM");
        const latState = window.localStorage.getItem("MAP_STATE_COORDINATES_LAT");
        const lngState = window.localStorage.getItem("MAP_STATE_COORDINATES_LNG");

        if (zoomState) {
            zoom = Number(zoomState);
        }

        if (latState && lngState) {
            lat = Number(latState);
            lng = Number(lngState);
        }

        let hash = window.location.hash;
        let hashParams = this.parseHash(hash);

        if (hashParams) {
            lat = hashParams.center[0];
            lng = hashParams.center[1];
            zoom = hashParams.zoom;
        }

        mapboxgl.accessToken = 'default';
        this.map = new mapboxgl.Map({
            container: mapElementId,
            style: 'http://188.134.5.249:5000/styles/osm-bright/style.json',
            zoom: (zoom || 11),
            center: [(lng || 30.30), (lat || 60.0)]
        });
        this.mapInvalidateSize();
        this.map.on('load', () => {
            this.mapReady.next(true);
        });

        var Draw = new MapboxDraw();

        // Map#addControl takes an optional second argument to set the position of the control.
        // If no position is specified the control defaults to `top-right`. See the docs 
        // for more details: https://www.mapbox.com/mapbox-gl-js/api/map#addcontrol

        this.map.addControl(Draw, 'top-right');

        this.saveMapPosition();
    }


    parseHash(hash) {
        if (hash.indexOf('#') === 0) hash = hash.substr(1);

        const hashParams = hash.split("/");
        if (hashParams.length === 3) {
            let zoom = parseInt(hashParams[2], 10),
                lat = parseFloat(hashParams[0]),
                lng = parseFloat(hashParams[1]);

            return (isNaN(zoom) || isNaN(lat) || isNaN(lng)) ? false : { center: [lat, lng], zoom };
        } else {
            return false;
        }
    }

    updatePositionOnHashChange(e) {
        let hash = window.location.hash;
        let hashParams = this.parseHash(hash);

        let center, zoom;
        if (hashParams) {
            center = hashParams.center;
            zoom = hashParams.zoom;
            this.map.setView(center, zoom);
        }
    }

    updateHashOnPositionChange() {
        let newHash;
        let zoom = this.map.getZoom();
        let center = this.map.getCenter();

        if (zoom && center.lat && center.lng) newHash = `#${center.lat}/${center.lng}/${zoom}`;
        if (newHash) window.location.hash = newHash;

    }

    updateMapPosition(latLng, zoom) {
        this.map.setView(latLng, zoom);
        return this;
    }

    saveMapPosition() {

        let saveMapState = () => {
            window.localStorage.setItem("MAP_STATE_ZOOM", this.map.getZoom());
            window.localStorage.setItem("MAP_STATE_COORDINATES_LAT", this.map.getCenter().lat);
            window.localStorage.setItem("MAP_STATE_COORDINATES_LNG", this.map.getCenter().lng);
        };

        window.addEventListener("beforeunload", saveMapState);
    }
}
