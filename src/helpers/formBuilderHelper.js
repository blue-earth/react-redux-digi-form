import { findItemById } from 'helpers/pureFunctions';
import _ from 'lodash';
import {
  INIT_QUESTION_STATE
} from 'redux/modules/formBuilder';

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

export const isCurrentElementId = (id, currentElement) =>
  currentElement && id === currentElement.id;

export const getActiveBoxIndex = (currentElement) =>
  _.get(currentElement, ['mappingInfo', 'activeIndex'], false);

export const isActiveBox = (currentElement, index) =>
  currentElement && getActiveBoxIndex(currentElement) === index;

export const getDragSnappingTargets = (documentMapping, currentElement, pageZoom) => {
  const activeBoxPosition = _.get(currentElement, [
    'mappingInfo', 'positions', getActiveBoxIndex(currentElement)
  ], null);
  var snappingTargets = [];

  documentMapping.forEach((mappingInfo) => {
    const finalMappingInfo = isCurrentElementId(mappingInfo.id, currentElement)
      ? currentElement.mappingInfo
      : mappingInfo;

    finalMappingInfo.positions.forEach((position, index) => {
      if (!position) return;
      const boundingBox = position.bounding_box;
      if (isCurrentElementId(mappingInfo.id, currentElement) && isActiveBox(currentElement, index)) return;
      if (position.page_number !== activeBoxPosition.page_number) return;
      snappingTargets = _.concat(snappingTargets, [
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
  });
  return snappingTargets;
};

export const zoomValue = (value, zoom) => {
  return Math.round(value * zoom * 100) / 100;
};

export const getResizeSnappingTargets = (documentMapping, currentElement, pageZoom) => {
  const boundingBox = _.get(currentElement, [
    'mappingInfo', 'positions', getActiveBoxIndex(currentElement), 'bounding_box'
  ], null);
  var snappingTargets = [];

  documentMapping.forEach((mappingInfo) => {
    const finalMappingInfo = isCurrentElementId(mappingInfo.id, currentElement)
      ? currentElement.mappingInfo
      : mappingInfo;

    finalMappingInfo.positions.forEach((position, index) => {
      if (!position) return;
      const targetBoundingBox = position.bounding_box;
      snappingTargets = _.concat(snappingTargets, [
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
      ]);
    });
  });
  return snappingTargets;
};

export const getDragSnappingHelpersRect = (elRect, currentElement, documentMapping, pageZoom) => {
  const snappingTargets = getDragSnappingTargets(documentMapping, currentElement, pageZoom);

  var helperRects = [];

  for (let item of snappingTargets) {
    const mappingInfo = isCurrentElementId(item.id, currentElement)
      ? currentElement.mappingInfo
      : findItemById(documentMapping, item.id);

    mappingInfo.positions.forEach((position, index) => {
      if (!position) return;
      if (isCurrentElementId(mappingInfo.id, currentElement) && isActiveBox(currentElement, index)) return;

      const boundingBox = position.bounding_box;
      var targetBoundingBox = _.assign({}, boundingBox);
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
    });
  }
  return helperRects;
};

export const getResizeSnappingHelpersPos = (elRect, currentElement, documentMapping, pageZoom) => {
  const snappingTargets = getDragSnappingTargets(documentMapping, currentElement, pageZoom);
  var helpersPos = [];
  var hasWidthSnapping = false;
  var hasHeightSnapping = false;
  for (let item of snappingTargets) {
    const mappingInfo = isCurrentElementId(item.id, currentElement)
      ? currentElement.mappingInfo
      : findItemById(documentMapping, item.id);

    mappingInfo.positions.forEach((position, index) => {
      if (!position) return;
      if (isCurrentElementId(mappingInfo.id, currentElement) && isActiveBox(currentElement, index)) return;

      const boundingBox = position.bounding_box;
      var targetBoundingBox = _.assign({}, boundingBox);
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
    });
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
  console.log(helpersPos);
  return helpersPos;
};

export const pageZoomPercent = (pageZoom) =>
  Math.round(pageZoom * 100) + '%';

export const getChoiceLabelByIndex = (index) =>
  String.fromCharCode('A'.charCodeAt(0) + index);

export const createEmptyQuestionElement = function (questionTypeName, boxMappingType) {
  const id = undefined;
  const activeBox = undefined;
  const question = Object.assign({}, INIT_QUESTION_STATE, {
    type: questionTypeName
  });
  return {
    id,
    question,
    mappingInfo: {},
    activeBox,
    isModified: false
  };
};
