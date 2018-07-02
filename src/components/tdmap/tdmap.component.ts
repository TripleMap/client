import { Component, AfterViewInit } from "@angular/core";
import { MapService } from "../../services/map-services/MapService";
import { MapLayersService } from "../../services/map-services/MapLayersService";
@Component({
    selector: "td-map",
    templateUrl: "./tdmap.component.html",
    styleUrls: ["./tdmap.component.css"]
})
export class TdmapComponent implements AfterViewInit {
    constructor(
        public MapService: MapService,
        public MapLayersService: MapLayersService
    ) { }

    ngAfterViewInit() {
        this.MapService.createMap("map");
        this.MapService.mapInvalidateSize();
    }
}
