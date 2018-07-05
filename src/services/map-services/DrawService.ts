import { Injectable } from '@angular/core';
import { MapService } from './MapService';
import { MeasureService, MEASURE_STYLES } from './MeasureService';
import { SpatialFilterService } from './SpatialFilterService'

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  public editor: any;
  constructor(
    public MapService: MapService,
    public MeasureService: MeasureService,
    public SpatialFilterService: SpatialFilterService
  ) {
    this.MapService.mapReady.subscribe(ready => {
      if (!ready) return;
      const map = this.MapService.getMap();
      const draw = new MapboxDraw({
        styles: this.collectStyles(),
        modes: this.collectModes(),
      });

      map.addControl(draw, 'top-left');
      this.editor = draw;
      this.MeasureService.initialyze(draw);
    });
  }

  private collectModes() {
    let measure = Object.assign(this.MeasureService.modes(), MapboxDraw.modes);
    let spatial = Object.assign(this.SpatialFilterService.modes(), measure);
    return spatial;
  }

  private collectStyles() {
    return [...MEASURE_STYLES]
  }

  public startPolylineMeasure() {
    this.editor = this.editor.changeMode('measure_line');
  }

  public startPolygonMeasure() {
    this.editor = this.editor.changeMode('measure_polygon');
  }

  public stopMeasure() {
    if (this.editor) {
      this.MeasureService.removeLayers();
      this.MeasureService.stopMeasure();
    }
  }



  public startCircleSpatialFilter() {
    this.editor = this.editor.changeMode('spatial_filter_radius_mode');
  }

  public startPolygonSpatialFilter() {

  }

  public stopSpatialFilter() {

  }

}
