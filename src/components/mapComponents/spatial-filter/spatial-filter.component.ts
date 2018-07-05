import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../services/map-services/MapService';
// import { FilterGeometryAdapter } from "../../../services/FilterGeometryAdapter";
import { DrawService } from '../../../services/map-services/DrawService';

@Component({
  selector: 'spatial-filter',
  templateUrl: './spatial-filter.component.html',
  styleUrls: ['./spatial-filter.component.css']
})
export class SpatialFilterComponent implements OnInit {
  public spatialFilterPoligonIsActive: boolean = false;
  public spatialFilterCircleIsActive: boolean = false;
  public spatialFilterGeometry: { type: string; geometry: any; };
  constructor(
    public MapService: MapService,
    //  public FilterGeometryAdapter: FilterGeometryAdapter,
    private DrawService: DrawService
  ) { }

  ngOnInit() {
  }


  startCircleSpatialFilter() {
    this.spatialFilterCircleIsActive = true;
    this.spatialFilterPoligonIsActive = false;
    this.DrawService.stopSpatialFilter();
    this.DrawService.startCircleSpatialFilter();
  }

  startPolygonSpatialFilter() {
    this.spatialFilterPoligonIsActive = true;
    this.spatialFilterCircleIsActive = false;
    this.DrawService.stopSpatialFilter();
    this.DrawService.startPolygonSpatialFilter();
  }

  stopSpatialFilter() {
    this.spatialFilterPoligonIsActive = false;
    this.spatialFilterCircleIsActive = false;
    this.DrawService.stopSpatialFilter();
    // this.FilterGeometryAdapter.mainFlow.next({ spatialFilter: null })
  }


  subscribeOnSpatialFilterBounds(e) {
    // this.FilterGeometryAdapter.mainFlow.next({
    //   spatialFilter: {
    //     type: "bounds",
    //     geometry: e[0].map(item => `${item[0]} ${item[1]}`).join(',')
    //   }
    // });
  }

  subscribeOnSpatialFilterCircle(e) {
    // this.FilterGeometryAdapter.mainFlow.next({
    //   spatialFilter: {
    //     type: "circle",
    //     geometry: {
    //       radius: e.radius.toFixed(2).toString(),
    //       point: `${e.centerPoint.lng} ${e.centerPoint.lat}`
    //     }
    //   }
    // });
  }
}
