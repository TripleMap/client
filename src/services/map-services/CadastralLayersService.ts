import { Injectable } from '@angular/core';
import { MapService } from './MapService';

export interface CadastralLayer { layerId: string; labelName: string; layerUrl: string; attribution: any; visible: boolean }
@Injectable({
  providedIn: 'root'
})
export class CadastralLayersService {
  public cadastralLayersOptions: CadastralLayer[] = [];
  constructor(public MapService: MapService) {
    this.initCadastralLayers();
  }

  initCadastralLayers() {
    let urlOptions = `&dpi=96&f=image&transparent=true&format=png32&bboxSR=3857&imageSR=3857&size=512,512`

    this.cadastralLayersOptions = [{
      layerId: 'zu',
      labelName: 'Земельные участки',
      layerUrl: `http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?bbox={bbox-epsg-3857}&layers=show:22,23,24,36,37${urlOptions}`,
      attribution: '<a href="https://pkk5.rosreestr.ru/">Публичная кадастрвоая карта</a>',
      visible: false
    }, {
      layerId: 'oks',
      labelName: 'Объекты капитального строительства',
      layerUrl: `http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?bbox={bbox-epsg-3857}&layers=show:26,27,28,29,30,31${urlOptions}`,
      attribution: '<a href="https://pkk5.rosreestr.ru/">Публичная кадастрвоая карта</a>',
      visible: false
    }, {
      layerId: 'okrug',
      labelName: 'Кадастровые округа',
      layerUrl: `http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?bbox={bbox-epsg-3857}&layers=show:1,2,3,4,5,6,7${urlOptions}`,
      attribution: '<a href="https://pkk5.rosreestr.ru/">Публичная кадастрвоая карта</a>',
      visible: false
    }, {
      layerId: 'district',
      labelName: 'Кадастровые районы',
      layerUrl: `http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?bbox={bbox-epsg-3857}&layers=show:9,10,11,12,13,14,15,16${urlOptions}`,
      attribution: '<a href="https://pkk5.rosreestr.ru/">Публичная кадастрвоая карта</a>',
      visible: false
    }, {
      layerId: 'kvartal',
      labelName: 'Кадастровые кварталы',
      layerUrl: `http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?bbox={bbox-epsg-3857}&layers=show:18,19,20${urlOptions}`,
      attribution: '<a href="https://pkk5.rosreestr.ru/">Публичная кадастрвоая карта</a>',
      visible: false
    }, {
      layerId: 'zouit',
      labelName: 'Росреестр ЗОУИТ',
      layerUrl: `http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/ZONES/MapServer/export?bbox={bbox-epsg-3857}&layers=show:0${urlOptions}`,
      attribution: '<a href="https://pkk5.rosreestr.ru/">Публичная кадастрвоая карта</a>',
      visible: false
    }];
  }


  getCadastrOverLayers = () => this.cadastralLayersOptions;
  getCadastrOverLayersLabelNames = () => this.cadastralLayersOptions.map((cadLayerModel: CadastralLayer) => cadLayerModel.labelName);

  getActiveCadastrLayersLabelName = () => this.cadastralLayersOptions
    .filter((cadLayerModel: CadastralLayer) => cadLayerModel.visible ? true : false)
    .map(cadLayerModel => cadLayerModel.labelName);

  getActiveCadastrLayers = () => this.cadastralLayersOptions.filter((cadLayerModel: CadastralLayer) => cadLayerModel.visible ? true : false);

  getActiveCadastrLayersId = () => this.cadastralLayersOptions
    .filter((cadLayerModel: CadastralLayer) => cadLayerModel.visible ? true : false)
    .map(cadLayerModel => cadLayerModel.layerId);

  getCadastrOverLayerById = (layerId) => this.cadastralLayersOptions.filter(cadLayerModel => cadLayerModel.layerId === layerId ? cadLayerModel : false)
    .pop();

  addCadLayerToMap = (layerId) => {
    const map = this.MapService.getMap()
    const layerData: CadastralLayer = this.cadastralLayersOptions.filter(cadLayerModel => cadLayerModel.layerId === layerId ? cadLayerModel : false)
      .pop();

    if (layerData) {
      layerData.visible = true;
      map.addLayer({
        'id': layerData.layerId,
        'type': 'raster',
        'source': {
          'type': 'raster',
          'tiles': [layerData.layerUrl],
          'tileSize': 512
        },
        'paint': {}
      });
    }

  };

  removeCadLayerFromMap = (layerId) => {
    const map = this.MapService.getMap()
    const layerData: CadastralLayer = this.cadastralLayersOptions.filter(cadLayerModel => cadLayerModel.layerId === layerId ? cadLayerModel : false)
      .pop();
    if (layerData && map.getLayer(layerData.layerId)) {
      layerData.visible = false;
      map.removeLayer(layerData.layerId);
      if (map.getSource(layerData.layerId)) {
        map.removeSource(layerData.layerId);
      }
    }
  }
}
