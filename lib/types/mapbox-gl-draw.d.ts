declare module "@mapbox/mapbox-gl-draw" {
  import { IControl } from "mapbox-gl";

  export default class MapboxDraw implements IControl {
    constructor(options?: unknown);

    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;

    getAll(): {
      type: "FeatureCollection";
      features: GeoJSON.Feature[];
    };

    deleteAll(): void;
  }
}
