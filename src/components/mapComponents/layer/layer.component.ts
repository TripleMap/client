import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MapLayersService, LayerSchema } from '../../../services/map-services/MapLayersService';
import { MapService } from '../../../services/map-services/MapService';
import { CadastralLayersService, CadastralLayer } from '../../../services/map-services/CadastralLayersService';


@Component({
  selector: 'layer-selection',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LayerComponent {
  public cadastrOverLayers: any = [];
  public overlayLayers: LayerSchema[] = [];
  public isActive = false;

  constructor(
    public MapService: MapService,
    public MapLayersService: MapLayersService,
    public CadastralLayersService: CadastralLayersService,
    public ChangeDetectorRef: ChangeDetectorRef
  ) {
    MapService.mapReady.subscribe(ready => {
      if (!ready) return;
      this.cadastrOverLayers = this.CadastralLayersService.getCadastrOverLayers();
      this.MapLayersService.layersChange.subscribe(change => {
        if (!change) return;
        this.overlayLayers = this.MapLayersService.layersSchemas;
        this.setOverlayLaersOnInit();
      });

      this.setCadastrOverLaersOnInit();
      const saveMapState = () => {
        window.localStorage.setItem('MAP_STATE_VISIBLE_CAD_LAYERS', this.CadastralLayersService.getActiveCadastrLayersId().toString());
        window.localStorage.setItem('MAP_STATE_VISIBLE_OVERLAY_LAYERS', this.MapLayersService.getActiveLayersId().toString());
        return null;
      }
      window.addEventListener("beforeunload", (e) => saveMapState());
    })
  }

  setCadastrOverLaersOnInit() {
    const cadlayersName = window.localStorage.getItem('MAP_STATE_VISIBLE_CAD_LAYERS');
    if (cadlayersName) {
      cadlayersName.split(',').map(item => {
        let CadastralLayers: CadastralLayer[] = this.CadastralLayersService.getCadastrOverLayers();
        for (let i = 0; i < CadastralLayers.length; i++) {
          if (item === CadastralLayers[i].layerId) {
            this.CadastralLayersService.addCadLayerToMap(item)
          };
        }
      })
    }
  }

  setOverlayLaersOnInit() {
    const overlayLayers = window.localStorage.getItem('MAP_STATE_VISIBLE_OVERLAY_LAYERS');
    if (!overlayLayers) return;
    overlayLayers.split(',').map(item => {
      this.overlayLayers.map(mapItem => {
        if (item === mapItem.id) this.MapLayersService.addLayerToMapById(mapItem.id);
      });
    });
    this.ChangeDetectorRef.detectChanges();
  }

  transformMaterial = event => this.isActive = !this.isActive;
  cadastrOverLayerChecked = (e, item: CadastralLayer) => e.checked ? this.CadastralLayersService.addCadLayerToMap(item.layerId) : this.CadastralLayersService.removeCadLayerFromMap(item.layerId);
  changeOverLayLayer = overlayLayer => overlayLayer.layer_schema.options.visible ? this.MapLayersService.addLayerToMapById(overlayLayer.id) : this.MapLayersService.removeLayerFromMapById(overlayLayer.id);
}
