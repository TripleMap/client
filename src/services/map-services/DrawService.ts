import { Injectable } from '@angular/core';
import { MapService } from './MapService';
import { MeasureService, MEASURE_STYLES } from './MeasureService';
import { SpatialFilterService } from './SpatialFilterService'

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  public measureEditor: any;
  public spatialFilterEditor: any;
  constructor(
    public MapService: MapService,
    public MeasureService: MeasureService,
    public SpatialFilterService: SpatialFilterService
  ) {
    this.MapService.mapReady.subscribe(ready => {
      if (!ready) return;
      const map = this.MapService.getMap();
      const measureEditor = new MapboxDraw({
        drawClient: 'measure',
        styles: MEASURE_STYLES,
        modes: Object.assign(this.MeasureService.modes(), MapboxDraw.modes),
      });

      map.addControl(measureEditor, 'top-left');
      this.measureEditor = measureEditor;
      this.MeasureService.initialyze(measureEditor);

      const spatialFilterEditor = new MapboxDraw({
        drawClient: 'spatialFilter',
        modes: Object.assign(this.SpatialFilterService.modes(), MapboxDraw.modes)
      });
      map.addControl(spatialFilterEditor, 'top-left');
      this.spatialFilterEditor = spatialFilterEditor;
    });
  }


  public startPolylineMeasure() {
    this.measureEditor = this.measureEditor.changeMode('measure_line');
  }

  public startPolygonMeasure() {
    this.measureEditor = this.measureEditor.changeMode('measure_polygon');
  }

  public stopMeasure() {
    if (this.measureEditor) {
      this.MeasureService.removeLayers();
      this.MeasureService.stopMeasure();
    }
  }



  public startCircleSpatialFilter() {
    this.spatialFilterEditor = this.spatialFilterEditor.changeMode('spatial_filter_radius_mode');
  }

  public startPolygonSpatialFilter() {

  }

  public stopSpatialFilter() {

  }

}
