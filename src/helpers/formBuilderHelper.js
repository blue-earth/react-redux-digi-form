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
  const activeBox = _.get(currentElement, ['activeBox'], '');
  const activeBoxPosition = _.get(currentElement.mappingInfo, activeBox, null);
  var snappingTargets = [];

  Object.keys(documentMapping).forEach((id) => {
    const mappingInfo = documentMapping[id];
    const finalMappingInfo = isCurrentElementId(id, currentElement)
      ? currentElement.mappingInfo
      : mappingInfo;

    Object.keys(finalMappingInfo).map((label) => {
      const positions = finalMappingInfo[label].positions;

      Object.keys(positions).forEach((positionKey) => {
        const position = positions[positionKey];
        const boundingBox = position.box;
        const path = _.join([label, 'positions', positionKey], '.');

        if (_.isEqual(path, activeBox)) return false;
        if (position.page !== activeBoxPosition.page) return;
        snappingTargets = _.concat(snappingTargets, [
          {
            x: zoomValue(boundingBox.left, pageZoom),
            type: 'left',
            id,
            path
          },
          {
            y: zoomValue(boundingBox.top, pageZoom),
            type: 'top',
            id,
            path
          },
          {
            x: zoomValue(boundingBox.left + boundingBox.width, pageZoom),
            type: 'right',
            id,
            path
          },
          {
            y: zoomValue(boundingBox.top + boundingBox.height, pageZoom),
            type: 'bottom',
            id,
            path
          },
          {
            x: zoomValue(boundingBox.left + boundingBox.width / 2, pageZoom),
            type: 'hcenter',
            id,
            path
          },
          {
            y: zoomValue(boundingBox.top + boundingBox.height / 2, pageZoom),
            type: 'vcenter',
            id,
            path
          }
        ]);
      });
    });
  });
  return snappingTargets;
};

export const zoomValue = (value, zoom) => {
  return Math.round(value * zoom * 100) / 100;
};

export const getResizeSnappingTargets = (documentMapping, currentElement, pageZoom) => {
  const activeBox = _.get(currentElement, ['activeBox'], '');
  const activeBoxPosition = _.get(currentElement.mappingInfo, activeBox, null);
  const boundingBox = activeBoxPosition.box;
  var snappingTargets = [];

  Object.keys(documentMapping).forEach((id) => {
    const mappingInfo = documentMapping[id];
    const finalMappingInfo = isCurrentElementId(id, currentElement)
      ? currentElement.mappingInfo
      : mappingInfo;

    Object.keys(finalMappingInfo).map((label) => {
      const positions = finalMappingInfo[label].positions;

      Object.keys(positions).forEach((positionKey) => {
        const position = positions[positionKey];
        const path = _.join([label, 'positions', positionKey], '.');

        if (_.isEqual(path, activeBox)) return false;
        if (position.page !== activeBoxPosition.page) return;

        const targetBoundingBox = position.box;
        snappingTargets = _.concat(snappingTargets, [
          {
            x: zoomValue(boundingBox.left + targetBoundingBox.width, pageZoom),
            type: 'width',
            id,
            path
          },
          {
            x: zoomValue(boundingBox.left + boundingBox.width - targetBoundingBox.width, pageZoom),
            type: 'width',
            id,
            path
          },
          { // incase inverse resize.
            x: zoomValue(boundingBox.left - targetBoundingBox.width, pageZoom),
            type: 'width',
            id,
            path
          },
          { // incase inverse resize.
            x: zoomValue(boundingBox.left + boundingBox.width + targetBoundingBox.width, pageZoom),
            type: 'width',
            id,
            path
          },
          {
            y: zoomValue(boundingBox.top + targetBoundingBox.height, pageZoom),
            type: 'height',
            id,
            path
          },
          {
            y: zoomValue(boundingBox.top + boundingBox.height - targetBoundingBox.height, pageZoom),
            type: 'height',
            id,
            path
          },
          { // incase inverse resize.
            y: zoomValue(boundingBox.top - targetBoundingBox.height, pageZoom),
            type: 'height',
            id,
            path
          },
          { // incase inverse resize.
            y: zoomValue(boundingBox.top + boundingBox.height + targetBoundingBox.height, pageZoom),
            type: 'height',
            id,
            path
          }
        ]);
      });
    });
  });
  return snappingTargets;
};

export const getDragSnappingHelpersRect = (elRect, currentElement, documentMapping, pageZoom) => {
  const snappingTargets = getDragSnappingTargets(documentMapping, currentElement, pageZoom);
  const activeBox = _.get(currentElement, ['activeBox'], '');
  const activeBoxPosition = _.get(currentElement.mappingInfo, activeBox, null);
  var helperRects = [];

  for (let item of snappingTargets) {
    const mappingInfo = isCurrentElementId(item.id, currentElement)
      ? currentElement.mappingInfo
      : documentMapping[item.id];

    const position = _.get(mappingInfo, item.path);
    if (_.isEqual(item.path, activeBox)) continue;
    if (position.page !== activeBoxPosition.page) continue;

    var targetBoundingBox = _.assign({}, position.box);
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

export const getResizeSnappingHelpersPos = (elRect, currentElement, documentMapping, pageZoom) => {
  const snappingTargets = getResizeSnappingTargets(documentMapping, currentElement, pageZoom);
  const activeBox = _.get(currentElement, ['activeBox'], '');
  const activeBoxPosition = _.get(currentElement.mappingInfo, activeBox, null);
  var helpersPos = [];
  var hasWidthSnapping = false;
  var hasHeightSnapping = false;

  for (let item of snappingTargets) {
    const mappingInfo = isCurrentElementId(item.id, currentElement)
      ? currentElement.mappingInfo
      : documentMapping[item.id];

    const position = _.get(mappingInfo, item.path);
    if (_.isEqual(item.path, activeBox)) continue;
    if (position.page !== activeBoxPosition.page) continue;

    var targetBoundingBox = _.assign({}, position.box);
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
