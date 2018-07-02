import { Component } from "@angular/core";
import { MapService } from '../../../services/map-services/MapService';

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
    }
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
    }
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
    }
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
    }
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
    },
    "text-field": `id`,
    "text-font": ["Roboto", "Arial Unicode MS Bold"],
    "text-size": 12,
    "text-offset": [1, -1]
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
    },
    "text-field": `id`,
    "text-font": ["Roboto", "Arial Unicode MS Bold"],
    "text-size": 12,
    "text-offset": [1, -1]
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
    },
    "text-field": `id`,
    "text-font": ["Roboto", "Arial Unicode MS Bold"],
    "text-size": 12,
    "text-offset": [1, -1]
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
    },
    "text-field": `id`,
    "text-font": ["Roboto", "Arial Unicode MS Bold"],
    "text-size": 12,
    "text-offset": [1, -1]
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
      'line-width': 3
    }
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
    }
  }, {
    'id': 'tdmap-draw-point-static',
    'type': 'circle',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#008CE5'
    }
  }
];



@Component({
  selector: "measure-controls",
  templateUrl: "./measure.component.html",
  styleUrls: ["./measure.component.css"]
})
export class MeasureComponent {
  public isActive = false;
  public measureToolsIsActive = false;
  public measureTools: any;
  constructor(
    public MapService: MapService
  ) {
    this.MapService.mapReady.subscribe(ready => {
      if (!ready) return;
      const map = this.MapService.getMap()
      const draw = new MapboxDraw({
        styles: MAPBOX_DRAW_STYLES
      });
      map.addControl(draw, 'top-left');
      this.measureTools = draw;
    })

  }

  showMeasureTools = () => (this.isActive = !this.isActive);

  startPolylineMeasure() {
    this.measureTools = this.measureTools.changeMode('draw_line_string');
    console.log(this.measureTools.getAll())
    console.log(this.MapService.getMap().getStyle().layers)
    this.measureToolsIsActive = true;
    console.log(this.measureTools)
    console.log(this.MapService.getMap().getStyle())
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
}
