import { Component } from "@angular/core";
import { MapService } from '../../../services/map-services/MapService';
import { DrawService } from '../../../services/map-services/DrawService';


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
    public MapService: MapService,
    public DrawService: DrawService
  ) { }

  showMeasureTools = () => (this.isActive = !this.isActive);
  startPolylineMeasure() {
    this.DrawService.startPolylineMeasure();
    this.measureToolsIsActive = true;
  }

  startPolygonMeasure() {
    this.DrawService.startPolygonMeasure();
    this.measureToolsIsActive = true;
  }

  stopMeasure() {
    this.measureToolsIsActive = false;
    this.DrawService.stopMeasure();
  }
}
