import { findItemById } from 'helpers/pureFunctions';
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

export const getDragSnappingTargets = (documentMapping, excludeId, pageZoom) => {
  var snappingTargets = [];
  documentMapping.forEach((mappingInfo) => {
    const boundingBox = mappingInfo.bounding_box[0];
    if (excludeId === mappingInfo.id) return;
    snappingTargets = _.unionWith(snappingTargets, [
      {
        x: zoomValue(boundingBox.left, pageZoom),
        type: 'left',
        id: mappingInfo.id
      },
      {
        y: zoomValue(boundingBox.top, pageZoom),
        type: 'top',
        id: mappingInfo.id
      },
      {
        x: zoomValue(boundingBox.left + boundingBox.width, pageZoom),
        type: 'right',
        id: mappingInfo.id
      },
      {
        y: zoomValue(boundingBox.top + boundingBox.height, pageZoom),
        type: 'bottom',
        id: mappingInfo.id
      },
      {
        x: zoomValue(boundingBox.left + boundingBox.width / 2, pageZoom),
        type: 'hcenter',
        id: mappingInfo.id
      },
      {
        y: zoomValue(boundingBox.top + boundingBox.height / 2, pageZoom),
        type: 'vcenter',
        id: mappingInfo.id
      }
    ]);
  });
  return snappingTargets;
};

export const zoomValue = (value, zoom) => {
  return Math.round(value * zoom);
};

export const getResizeSnappingTargets = (documentMapping, excludeId, pageZoom) => {
  var snappingTargets = [];
  const boundingBox = findItemById(documentMapping, excludeId).bounding_box[0];
  documentMapping.forEach((mappingInfo) => {
    const targetBoundingBox = mappingInfo.bounding_box[0];
    if (excludeId === mappingInfo.id) return;
    snappingTargets = _.unionWith(snappingTargets, [
      {
        x: zoomValue(boundingBox.left + targetBoundingBox.width, pageZoom),
        type: 'width',
        id: mappingInfo.id
      },
      {
        x: zoomValue(boundingBox.left + boundingBox.width - targetBoundingBox.width, pageZoom),
        type: 'width',
        id: mappingInfo.id
      },
      { // incase inverse resize.
        x: zoomValue(boundingBox.left - targetBoundingBox.width, pageZoom),
        type: 'width',
        id: mappingInfo.id
      },
      { // incase inverse resize.
        x: zoomValue(boundingBox.left + boundingBox.width + targetBoundingBox.width, pageZoom),
        type: 'width',
        id: mappingInfo.id
      },
      {
        y: zoomValue(boundingBox.top + targetBoundingBox.height, pageZoom),
        type: 'height',
        id: mappingInfo.id
      },
      {
        y: zoomValue(boundingBox.top + boundingBox.height - targetBoundingBox.height, pageZoom),
        type: 'height',
        id: mappingInfo.id
      },
      { // incase inverse resize.
        y: zoomValue(boundingBox.top - targetBoundingBox.height, pageZoom),
        type: 'height',
        id: mappingInfo.id
      },
      { // incase inverse resize.
        y: zoomValue(boundingBox.top + boundingBox.height + targetBoundingBox.height, pageZoom),
        type: 'height',
        id: mappingInfo.id
      }
    ], _.isEqual);
  });
  return snappingTargets;
};

export const getDragSnappingHelpersRect = (elRect, excludeId, documentMapping, pageZoom) => {
  const snappingTargets = getDragSnappingTargets(documentMapping, excludeId, pageZoom);

  var helperRects = [];

  for (let item of snappingTargets) {
    var targetBoundingBox = _.assign({}, findItemById(documentMapping, item.id).bounding_box[0]);
    for (var prop in targetBoundingBox) {
      targetBoundingBox[prop] *= pageZoom;
    }
    var compX = elRect.left;
    var compY = elRect.top;
    if (item.type === 'hcenter') compX += elRect.width / 2;
    if (item.type === 'vcenter') compY += elRect.height / 2;
    if (item.type === 'right') compX += elRect.width;
    if (item.type === 'bottom') compY += elRect.height;

    compX = zoomValue(compX, 1);
    compY = zoomValue(compY, 1);

    if (item.x === compX || item.y === compY) {
      var helperRect = {
        top: _.min([compY, targetBoundingBox.top]),
        left: _.min([compX, targetBoundingBox.left]),
        width: 2,
        height: 2
      };
      if (item.x === compX) {
        helperRect.left = compX - 1; // 1px adjustment as helper width is 2px.
        helperRect.height =
          _.max([compY + elRect.height, targetBoundingBox.top + targetBoundingBox.height]) -
          _.min([compY, targetBoundingBox.top]);
      }
      if (item.y === compY) {
        helperRect.top = compY - 1;  // 1px adjustment as helper height is 2px.
        helperRect.width =
          _.max([compX + elRect.width, targetBoundingBox.left + targetBoundingBox.width]) -
          _.min([compX, targetBoundingBox.left]);
      }
      helperRects.push(helperRect);
    }
  }
  return helperRects;
};

export const getResizeSnappingHelpersPos = (elRect, excludeId, documentMapping, pageZoom) => {
  const snappingTargets = getDragSnappingTargets(documentMapping, excludeId, pageZoom);
  var helpersPos = [];
  var hasWidthSnapping = false;
  var hasHeightSnapping = false;
  for (let item of snappingTargets) {
    var targetBoundingBox = _.assign({}, findItemById(documentMapping, item.id).bounding_box[0]);
    for (var prop in targetBoundingBox) {
      targetBoundingBox[prop] = zoomValue(targetBoundingBox[prop], pageZoom);
    }
    if (elRect.width === targetBoundingBox.width) {
      hasWidthSnapping = true;
      helpersPos.push({
        x: targetBoundingBox.left,
        y: targetBoundingBox.top - 10,
        type: 'width',
        size: targetBoundingBox.width
      });
    }
    if (elRect.height === targetBoundingBox.height) {
      hasHeightSnapping = true;
      helpersPos.push({
        x: targetBoundingBox.left - 10,
        y: targetBoundingBox.top,
        type: 'height',
        size: targetBoundingBox.height
      });
    }
  }
  if (hasWidthSnapping) {
    helpersPos.push({
      x: elRect.left,
      y: elRect.top - 10,
      type: 'width',
      size: elRect.width
    });
  }
  if (hasHeightSnapping) {
    helpersPos.push({
      x: elRect.left - 10,
      y: elRect.top,
      type: 'height',
      size: elRect.height
    });
  }
  return helpersPos;
};
