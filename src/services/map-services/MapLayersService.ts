import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { MapService } from './MapService';
import { AuthService } from '../../auth/auth-service';
import { environment } from '../../environments/environment';
export const StyleLinks = {
    getAllData: (layerId) => `api/Layers/GetLayerFeaturesStyles?LayerId=${layerId}`,
    getUserStyles: () => `api/Layers/GetStyles?`,
    createUserStyle: () => `api/Layers/CreateStyle?`,
    deleteUserStyle: (styleId) => `api/Layers/DeleteStyle?styleId=${styleId}`,
    updateUserStyle: (styleId) => `api/Layers/UpdateStyle?styleId=${styleId}`,
}


export const LabelLinks = {
    getAllData: (layerId) => `api/Layers/GetLayerFeaturesLables?LayerId=${layerId}`,
    getUserLabels: () => `api/Layers/GetLables?`,
    createUserLabel: () => `api/Layers/CreateLable?`,
    deleteUserLabel: (labelId) => `api/Layers/DeleteLable?LabelId=${labelId}`,
    updateUserLabel: (labelId) => `api/Layers/UpdateLable?LabelId=${labelId}`,
}


export const LayersLinks = {
    getLayersByUserId: (userId) => `api/Accounts/userlayers?id=${userId}`,
    dataApi: () => "api/Layers",
    schemaInfoUrl: (layerId) => `api/Layers/GetGeoJSONLayerSchemaWithData?LayerId=${layerId}`,
    featuresFilterUrl: (layerId) => `api/Layers/GetFeaturesByFilters?LayerId=${layerId}`,
    getAllGeo: (layerId) => `api/Layers/GetGeoJSONFeatures?LayerId=${layerId}`,
    featuresEdit: {
        getFeatureGeoJSONById: (layerId, feautureId) => `api/Layers/GetGeoJSONFeature?LayerId=${layerId}&FeatureId=${feautureId}`,
        getAllInfo: (layerId) => `api/Layers/GetJSONFeatures?LayerId=${layerId}`,
        getInfo: (layerId, feautureId) => `api/Layers/GetJSONFeature?LayerId=${layerId}&FeatureId=${feautureId}`,
        create: (layerId, withCadastralData) => `api/Layers/CreateJSONFeature?LayerId=${layerId}&withCadastralData=${withCadastralData}`,
        updateById: (layerId, feautureId) => `api/Layers/UpdateJSONFeature?LayerId=${layerId}&id=${feautureId}`,
        updateByIds: (layerId) => `api/Layers/UpdateJSONFeatures?LayerId=${layerId}`,
        removeByIds: (layerId, feauturesId) => `api/Layers/RemoveGeoJSONFeature?LayerId=${layerId}&FeaturesId=${feauturesId}`,
        updateFeatureGeometryById: (layerId, feautureId) => `api/Layers/UpdateFeatureGeometry?LayerId=${layerId}&id=${feautureId}`,
    },
    featuresLabel: {
        getAllData: (layerId) => `api/Layers/GetLayerFeaturesLables?LayerId=${layerId}`
    },
    cadastralDataEdit: {
        create: (layerId, featureId) => `api/Layers/CreateFeatureCadastralInfo?LayerId=${layerId}&FeatureId=${featureId}`,
        updateByCn: (layerId, cadastralNumber) => `api/Layers/UpdateFeatureCadastralInfo?LayerId=${layerId}&cn=${cadastralNumber}`,
        deleteById: (layerId, feautureId) => `api/Layers/DeleteJSONFeature?LayerId=${layerId}&id=${feautureId}`,
    },
    additionalCharacters: {
        getAll: (layerId, feautureId) => `api/Layers/GetAdditionalCharacters?LayerId=${layerId}&FeatureId=${feautureId}`,
        getById: (layerId, additionalCharacterId) => `api/Layers/GetAdditionalCharacter?LayerId=${layerId}&id=${additionalCharacterId}`,
        create: (layerId, feautureId) => `api/Layers/CreateAdditionalCharacter?LayerId=${layerId}&FeatureId=${feautureId}`,
        updateById: (layerId, additionalCharacterId) => `api/Layers/UpdateAdditionalCharacter?LayerId=${layerId}&id=${additionalCharacterId}`,
        deleteById: (layerId, additionalCharacterId) => `api/Layers/DeleteAdditionalCharacter?LayerId=${layerId}&id=${additionalCharacterId}`
    },
    events: {
        getAll: (layerId, feautureId) => `api/Layers/GetEvents?LayerId=${layerId}&FeatureId=${feautureId}`,
        getById: (layerId, eventId) => `api/Layers/GetEvent?LayerId=${layerId}&EventId=${eventId}`,
        create: (layerId, feautureId) => `api/Layers/CreateEvent?LayerId=${layerId}&FeatureId=${feautureId}`,
        updateById: (layerId, eventId) => `api/Layers/UpdateEvent?LayerId=${layerId}&EventId=${eventId}`,
        deleteById: (layerId, eventId) => `api/Layers/DeleteEvent?LayerId=${layerId}&EventId=${eventId}`
    }
}

export interface LayerOptions {
    id: string;
    dataUrl: string;
    labelUrl: string;
    labelName: string;
    visible: boolean;
    maxZoom: number;
    minZoom: number;
    onceLoaded: boolean;
    styled: boolean;
    labeled: boolean;
    selectable: boolean;
    selectionOptions: {
        multiple: boolean;
    },
    style: any;
}

export interface LayerSchema {
    id: string;
    layer_name: string;
    layer_schema: {
        name: string;
        labelName: string;
        schema: string;
        table: string;
        options: LayerOptions;
        properties: { any };
    },
}

@Injectable()
export class MapLayersService {
    public visibleLayers: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
    public layersChange: BehaviorSubject<any> = new BehaviorSubject<any>(0);
    public layersSchemas: LayerSchema[] = [];
    constructor(
        public http: HttpClient,
        public MapService: MapService,
        public AuthService: AuthService
    ) {
        this.MapService.mapReady.subscribe(ready => {
            if (!ready) return;
            this.constructOverlayers();
        })

    };

    private constructOverlayers() {
        this.http.get(LayersLinks.getLayersByUserId(this.AuthService.getUserId()))
            .subscribe((layers: LayerSchema[]) => {
                this.layersSchemas = layers;
                layers.map(layer => {
                    if (layer.layer_schema.options.visible) {
                        const layerData = this.processSchemaToLayer(layer);
                        this.addSourceToMap(layerData);
                        this.addLayerToMap(layerData);
                        this.addSelectionLayer(layerData);
                    }
                });
                this.layersChange.next(1);
                // this.emitToLabelLeafletLayer();
            });

    };

    public addSourceToMap(layerData) {
        const map = this.MapService.getMap();
        map.addSource(`${layerData.id}_source`, layerData.source);
    };


    public addLayerToMap(layerData) {
        const map = this.MapService.getMap();
        map.addLayer(layerData.layerOptions);
        this.changeLayerVisibility(layerData.id, true);
    };

    public addSelectionLayer(layerData) {
        const map = this.MapService.getMap();
        map.addLayer(layerData.selectionLayerOptions);
        map.setFilter(`${layerData.layerOptions.id}_selected`, ["==", `id`, ""]);

    }

    public addLayerToMapById(layerId) {
        const map = this.MapService.getMap();
        const source = map.getSource(layerId);
        const mapLayer = map.getLayer(layerId);
        if (mapLayer) {
            this.changeLayerVisibility(layerId, true);
            return;
        }
        const layerData = this.processSchemaToLayer(this.getLayerSchemaById(layerId));
        if (!source && layerData) {
            this.addSourceToMap(layerData)
        }
        if (!mapLayer && layerData) {
            this.addLayerToMap(layerData);
            this.addSelectionLayer(layerData);
        }
        this.changeLayerVisibility(layerId, true);
    }

    public removeLayerFromMapById(layerId) {
        const map = this.MapService.getMap();
        const mapLayer = map.getLayer(layerId);
        const layerSchema: LayerSchema = this.getLayerSchemaById(layerId)
        if (mapLayer && layerSchema) {
            this.changeLayerVisibility(layerId, false);
        }
    };

    private changeLayerVisibility(layerId, visible) {
        const map = this.MapService.getMap();
        if (!map.getLayer(layerId)) return;
        let visibleOptions = visible ? 'visible' : 'none';
        const layerData = this.getLayerSchemaById(layerId);
        if (!layerData) return;
        layerData.layer_schema.options.visible = visible;
        map.setLayoutProperty(layerId, 'visibility', visibleOptions);
        this.visibleLayers.next(this.visibleLayers.getValue().filter(item => item === layerId ? false : item));
        if (map.getLayer(`${layerId}_selected`)) {
            map.setLayoutProperty(`${layerId}_selected`, 'visibility', visibleOptions);
        }
    }


    public processSchemaToLayer(schemaLayer: LayerSchema) {
        if (!schemaLayer) return;
        let style;
        if (schemaLayer
            && schemaLayer.layer_schema
            && schemaLayer.layer_schema.options
            && schemaLayer.layer_schema.options.style
        ) {
            style = schemaLayer.layer_schema.options.style;
        }
        const layerOptions = {
            id: schemaLayer.id,
            source: {
                type: 'geojson',
                data: `${environment.baseUrl}/${LayersLinks.getAllGeo(schemaLayer.id)}`,
                maxzoom: 24,
            },
            layerOptions: {
                'id': `${schemaLayer.id}`,
                'source': `${schemaLayer.id}_source`,
                'type': 'fill',
                'layout': {},
                'paint': {
                    'fill-color': style.fillColor || '#2952c2',
                    'fill-opacity': style.fillOpacity || 0.5,
                    'fill-outline-color': style.color || '#fff',
                }
            },
            selectionLayerOptions: {
                'id': `${schemaLayer.id}_selected`,
                'source': `${schemaLayer.id}_source`,
                'type': 'fill',
                'layout': {},
                'paint': {
                    'fill-color': style.fillColor || '#2952c2',
                    'fill-opacity': style.fillOpacity || 0.5,
                    'fill-outline-color': style.color || '#ff9800',

                }
            }
        }

        return layerOptions;
    }



    public getLayerSchemaById(id) {
        const filterLayers = this.layersSchemas.filter(item => item.id === id ? item : false);
        return filterLayers.length ? filterLayers[0] : null;
    };


    public getActiveLayersId = () => this.layersSchemas
        .filter(item => item.layer_schema.options.visible ? true : false)
        .map(item => item.id);



    // emitToLabelLeafletLayer() {
    //     this.http.get(LabelLinks.getUserLabels()).subscribe(
    //         (data: any[]) => {
    //             let labelsLayersId = data.map(label => label.layer_id)
    //             data.map(label => {
    //                 const leafletLayer = this._getLeafletLayerById(label.layer_id);
    //                 if (leafletLayer && label.active) leafletLayer.labelLayerChange.next(label);
    //                 if (leafletLayer && !label.active) leafletLayer.labelLayerChange.next(false);
    //             });
    //             this.mapLayers.map(layer => {
    //                 if (labelsLayersId.indexOf(layer.options.id) === -1) {
    //                     layer.labelLayerChange.next(false);
    //                 }
    //             });
    //         },
    //         error => { console.log(error) }
    //     )
    // }
}