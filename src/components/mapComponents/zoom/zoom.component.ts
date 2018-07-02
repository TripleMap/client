import { Component } from "@angular/core";
import { MapService } from '../../../services/map-services/MapService';

@Component({
  selector: "zoom-controls",
  templateUrl: "./zoom.component.html",
  styleUrls: ["./zoom.component.css"]
})
export class ZoomComponent {
  constructor(public MapService: MapService) { }

  zoomIn(e) {
    console.log()
    if (
      this.MapService.getMap().getZoom() <
      this.MapService.getMap().getMaxZoom()
    ) {
      this.MapService.getMap().zoomIn();
    }
  }
  zoomOut(e) {
    if (
      this.MapService.getMap().getZoom() >
      this.MapService.getMap().getMinZoom()
    ) {
      this.MapService.getMap().zoomOut();
    }
  }
}
