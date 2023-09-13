import { PointCloudLayer } from '@deck.gl/layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';

export function renderLayers(props) {
  const { data } = props;

  const layer = new PointCloudLayer({
    id: "point-cloud-layer",
    data: data,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getNormal: [0, 1, 0],
    getColor: [255, 255, 255],
    opacity: 0.5,
    pointSize: 1.5
  });

  return [layer];
}
