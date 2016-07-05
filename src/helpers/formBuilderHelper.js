import { findIndexById } from 'helpers/pureFunctions';
import _ from 'lodash';

export const getImageDimension = (url, callback) => {
  var img = new Image();
  img.onload = function () {
    callback({
      width: this.width,
      height: this.height
    });
  };
  img.src = url;
};

export const getDragSnappingTargets = (documentMapping, excludeId) => {
  var snappingTargets = [];
  documentMapping.forEach((mappingInfo) => {
    const boundingBox = mappingInfo.bounding_box[0];
    if (excludeId === mappingInfo.id) return;
    snappingTargets.push({
      x: boundingBox.left,
      type: 'left',
      id: mappingInfo.id
    });
    snappingTargets.push({
      y: boundingBox.top,
      type: 'top',
      id: mappingInfo.id
    });
    snappingTargets.push({
      x: boundingBox.left + boundingBox.width,
      type: 'right',
      id: mappingInfo.id
    });
    snappingTargets.push({
      y: boundingBox.top + boundingBox.height,
      type: 'bottom',
      id: mappingInfo.id
    });
    snappingTargets.push({
      x: boundingBox.left + boundingBox.width / 2,
      type: 'hcenter',
      id: mappingInfo.id
    });
    snappingTargets.push({
      y: boundingBox.top + boundingBox.height / 2,
      type: 'vcenter',
      id: mappingInfo.id
    });
  });
  return snappingTargets;
};

export const getResizeSnappingTargets = (documentMapping, excludeId) => {
  var snappingTargets = [];
  documentMapping.forEach((mappingInfo) => {
    const boundingBox = mappingInfo.bounding_box[0];
    if (excludeId === mappingInfo.id) return;
    snappingTargets.push({
      x: boundingBox.left,
      type: 'left',
      id: mappingInfo.id
    });
    snappingTargets.push({
      y: boundingBox.top,
      type: 'top',
      id: mappingInfo.id
    });
  });
  return snappingTargets;
};

export const getSnappingHelperRect = (elRect, snappingTargets, documentMapping) => {
  var helperRect = {left: 0, top: 0, width: 1, height: 1};
  for (let item of snappingTargets) {
    const targetIndex = findIndexById(documentMapping, item.id);
    const targetBoundingBox = documentMapping[targetIndex].bounding_box[0];
    var compX = elRect.left;
    var compY = elRect.top;
    if (item.type === 'hcenter') compX += elRect.width / 2;
    if (item.type === 'vcenter') compY += elRect.height / 2;
    if (item.type === 'right') compX += elRect.width;
    if (item.type === 'bottom') compY += elRect.height;
    if (item.x === compX || item.y === compY) {
      helperRect.top = _.min([compY, targetBoundingBox.top]);
      helperRect.left = _.min([compX, targetBoundingBox.left]);
      if (item.x === compX) {
        helperRect.left = compX;
        helperRect.height =
          _.max([compY + elRect.height, targetBoundingBox.top + targetBoundingBox.height]) -
          _.min([compY, targetBoundingBox.top]);
      }
      if (item.y === compY) {
        helperRect.top = compY;
        helperRect.width =
          _.max([compX + elRect.width, targetBoundingBox.left + targetBoundingBox.width]) -
          _.min([compX, targetBoundingBox.left]);
      }
      break;
    }
  }
  return helperRect;
};
