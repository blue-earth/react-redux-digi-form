import React from 'react';
import _ from 'lodash';
import { stripeTags } from './pureFunctions';
import {
  INIT_QUESTION_STATE
} from 'redux/modules/formBuilder';
import {
  formBuilderBox
} from 'constants/formBuilder';

export const getNextBoxIndex = (label, currentElement) => {
  // positions are stored as a map
  // This function should always return the next value that is next to largest index
  // {0: {}, 1: {}, 3: {}} --> next value will be 4
  var positions = _.get(currentElement, ['mappingInfo', label, 'positions']);
  var result = 0;
  if (positions) {
    var mappingIds = Object.keys(positions).map(x => parseInt(x, 10));
    var largest = Math.max.apply(null, mappingIds);
    result = largest + 1;
  }
  return result;
};

export const isCurrentElementId = (id, currentElement) =>
  (currentElement && _.isEqual(parseInt(id, 10), currentElement.id)) || _.isEqual(parseInt(id, 10), 0);

export const getArrangedBlocksPosition = (box, fontSize, blockCount) => {
  const { WIDTH, HEIGHT } = formBuilderBox;
  const ratio = 1;
  const blockMaxWidth = box[WIDTH] / blockCount;
  const blockWidth = Math.min(fontSize * ratio, blockMaxWidth);
  const blockHeight = box[HEIGHT];
  var blocks = [];
  var i = 0;
  for (; i < blockCount; i++) {
    blocks.push([
      blockMaxWidth * i + (blockMaxWidth - blockWidth) / 2, // left
      0,  // top
      blockWidth,  // width
      blockHeight  // height
    ]);
  }
  return blocks;
};

export const adjustModifiedBlocksPosition = (newBlocks, position) => {
  const { font_size: fontSize, box, blocks } = position;
  const { LEFT } = formBuilderBox;
  const arrangedBlocks = getArrangedBlocksPosition(box, fontSize, box.length);
  _.forEach(blocks, (block, index) => {
    newBlocks[index][LEFT] += block[LEFT] - arrangedBlocks[index][LEFT];
    newBlocks[index][LEFT] = Math.max(0, newBlocks[index][LEFT]);
  });
  return newBlocks;
};

export const getDragSnappingTargets = (documentMapping, currentElement, pageZoom) => {
  const activeBoxPath = _.get(currentElement, ['activeBoxPath'], '');
  const activeBoxPosition = _.get(currentElement.mappingInfo, activeBoxPath, null);
  const { LEFT, TOP, WIDTH, HEIGHT } = formBuilderBox;
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
        const box = position.box;
        const path = _.join([label, 'positions', positionKey], '.');

        if (_.isEqual(path, activeBoxPath) && isCurrentElementId(id, currentElement)) return;
        if (position.page !== activeBoxPosition.page) return;
        snappingTargets = _.concat(snappingTargets, [
          {
            x: zoomValue(box[LEFT], pageZoom),
            type: 'left',
            id,
            path
          },
          {
            y: zoomValue(box[TOP], pageZoom),
            type: 'top',
            id,
            path
          },
          {
            x: zoomValue(box[LEFT] + box[WIDTH], pageZoom),
            type: 'right',
            id,
            path
          },
          {
            y: zoomValue(box[TOP] + box[HEIGHT], pageZoom),
            type: 'bottom',
            id,
            path
          },
          {
            x: zoomValue(box[LEFT] + box[WIDTH] / 2, pageZoom),
            type: 'hcenter',
            id,
            path
          },
          {
            y: zoomValue(box[TOP] + box[HEIGHT] / 2, pageZoom),
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
  const activeBoxPath = _.get(currentElement, ['activeBoxPath'], '');
  const activeBoxPosition = _.get(currentElement.mappingInfo, activeBoxPath, null);
  const box = activeBoxPosition.box;
  const { LEFT, TOP, WIDTH, HEIGHT } = formBuilderBox;
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

        if (_.isEqual(path, activeBoxPath) && isCurrentElementId(id, currentElement)) return;
        if (position.page !== activeBoxPosition.page) return;

        const targetBox = position.box;
        snappingTargets = _.concat(snappingTargets, [
          {
            x: zoomValue(box[LEFT] + targetBox[WIDTH], pageZoom),
            type: 'width',
            id,
            path
          },
          {
            x: zoomValue(box[LEFT] + box[WIDTH] - targetBox[WIDTH], pageZoom),
            type: 'width',
            id,
            path
          },
          { // incase inverse resize.
            x: zoomValue(box[LEFT] - targetBox[WIDTH], pageZoom),
            type: 'width',
            id,
            path
          },
          { // incase inverse resize.
            x: zoomValue(box[LEFT] + box[WIDTH] + targetBox[WIDTH], pageZoom),
            type: 'width',
            id,
            path
          },
          {
            y: zoomValue(box[TOP] + targetBox[HEIGHT], pageZoom),
            type: 'height',
            id,
            path
          },
          {
            y: zoomValue(box[TOP] + box[HEIGHT] - targetBox[HEIGHT], pageZoom),
            type: 'height',
            id,
            path
          },
          { // incase inverse resize.
            y: zoomValue(box[TOP] - targetBox[HEIGHT], pageZoom),
            type: 'height',
            id,
            path
          },
          { // incase inverse resize.
            y: zoomValue(box[TOP] + box[HEIGHT] + targetBox[HEIGHT], pageZoom),
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
  const activeBoxPath = _.get(currentElement, ['activeBoxPath'], '');
  const activeBoxPosition = _.get(currentElement.mappingInfo, activeBoxPath, null);
  const { LEFT, TOP, WIDTH, HEIGHT } = formBuilderBox;
  var helperRects = [];

  for (let item of snappingTargets) {
    const mappingInfo = isCurrentElementId(item.id, currentElement)
      ? currentElement.mappingInfo
      : documentMapping[item.id];

    const position = _.get(mappingInfo, item.path);
    if (_.isEqual(item.path, activeBoxPath) && isCurrentElementId(item.id, currentElement)) continue;
    if (position.page !== activeBoxPosition.page) continue;

    var targetBox = _.assign({}, position.box);
    for (var prop in targetBox) {
      targetBox[prop] *= pageZoom;
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
        top: _.min([compY, targetBox[TOP]]),
        left: _.min([compX, targetBox[LEFT]]),
        width: 2,
        height: 2
      };
      if (item.x === compX) {
        helperRect.left = compX - 1; // 1px adjustment as helper width is 2px.
        helperRect.height =
          _.max([compY + elRect.height, targetBox[TOP] + targetBox[HEIGHT]]) -
          _.min([compY, targetBox[TOP]]);
      }
      if (item.y === compY) {
        helperRect.top = compY - 1;  // 1px adjustment as helper height is 2px.
        helperRect.width =
          _.max([compX + elRect.width, targetBox[LEFT] + targetBox[WIDTH]]) -
          _.min([compX, targetBox[LEFT]]);
      }
      helperRects.push(helperRect);
    }
  }
  return helperRects;
};

export const getResizeSnappingHelpersPos = (elRect, currentElement, documentMapping, pageZoom) => {
  const snappingTargets = getResizeSnappingTargets(documentMapping, currentElement, pageZoom);
  const activeBoxPath = _.get(currentElement, ['activeBoxPath'], '');
  const activeBoxPosition = _.get(currentElement.mappingInfo, activeBoxPath, null);
  const { LEFT, TOP, WIDTH, HEIGHT } = formBuilderBox;
  var helpersPos = [];
  var hasWidthSnapping = false;
  var hasHeightSnapping = false;

  for (let item of snappingTargets) {
    const mappingInfo = isCurrentElementId(item.id, currentElement)
      ? currentElement.mappingInfo
      : documentMapping[item.id];

    const position = _.get(mappingInfo, item.path);
    if (_.isEqual(item.path, activeBoxPath) && isCurrentElementId(item.id, currentElement)) continue;
    if (position.page !== activeBoxPosition.page) continue;

    var targetBox = _.assign({}, position.box);
    for (var prop in targetBox) {
      targetBox[prop] = zoomValue(targetBox[prop], pageZoom);
    }
    if (elRect.width === targetBox[WIDTH]) {
      hasWidthSnapping = true;
      helpersPos.push({
        x: targetBox[LEFT],
        y: targetBox[TOP] - 10,
        type: 'width',
        size: targetBox[WIDTH]
      });
    }
    if (elRect.height === targetBox[HEIGHT]) {
      hasHeightSnapping = true;
      helpersPos.push({
        x: targetBox[LEFT] - 10,
        y: targetBox[TOP],
        type: 'height',
        size: targetBox[HEIGHT]
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
  const activeBoxPath = undefined;
  const question = Object.assign({}, INIT_QUESTION_STATE, {
    type: questionTypeName
  });
  return {
    id,
    question,
    mappingInfo: {},
    activeBoxPath,
    isModified: false,
    defaultMappingType: boxMappingType
  };
};

export const getQuestionsByType = function (questions, targetQuestionType, includeTarget=true) {
  if (includeTarget) {
    // return questions of type targetQuestionType
    if (Array.isArray(targetQuestionType)) {
      return questions.filter((question) => targetQuestionType.indexOf(question.type) !== -1);
    } else {
      return questions.filter((question) => question.type === targetQuestionType);
    }
  } else {
    // return questions NOT of type targetQuestionType
    if (Array.isArray(targetQuestionType)) {
      return questions.filter((question) => targetQuestionType.indexOf(question.type) === -1);
    } else {
      return questions.filter((question) => question.type !== targetQuestionType);
    }
  }
};

export const getQuestionsById = function (questions, targetQuestionId, includeTarget=true) {
  if (includeTarget) {
    // return questions with Id targetQuestionId
    if (Array.isArray(targetQuestionId)) {
      return questions.filter((question) => targetQuestionId.indexOf(question.id) !== -1);
    } else {
      return questions.filter((question) => question.id === targetQuestionId);
    }
  } else {
    // return questions NOT with Id targetQuestionId
    if (Array.isArray(targetQuestionId)) {
      return questions.filter((question) => targetQuestionId.indexOf(question.id) === -1);
    } else {
      return questions.filter((question) => question.id !== targetQuestionId);
    }
  }
};

export const mapQuestionsToDropdown = function (questions) {
  return questions.map(function (q) {
    var instructionNoHTML = q.question_instruction.replace(/(<([^>]+)>)/ig, '');
    return {
      'label': (<span><span>{q.id}. </span><span>{instructionNoHTML}</span></span>),
      'value': q.id,
      'id': q.id,
      'type': q.type
    };
  });
};

export const transformQuestionsToTreeData = (questions) => (
  _.map(questions, (question) => (
    _.merge(
      {
        title: stripeTags(question.question_instruction || question.title),
        id: question.id,
        type: question.type,
        leaf: true,
        question
      },
      _.isNil(question.group) ? {} : { group: question.group }
    )
  ))
);

export const getTreeDataFromQuestions = (questions) => {
  const tempGroup = _.groupBy(transformQuestionsToTreeData(questions), (q) => (
    q.type === 'Group' ? 'groups' : typeof q.group !== 'undefined' ? q.group : 'orphans'
  ));

  var newGroup = [];
  for (var groupId in tempGroup.groups) {
    var group = tempGroup.groups[groupId];
    newGroup.push({
      id: group.id,
      title: group.title,
      question: group.question,
      children: tempGroup[group.id]
    });
  }

  return newGroup;
};

export const getQuestionsFromTreeData = (treeData) => {
  let questions = [];
  _.each(treeData.children, group => {
    questions.push(group.question);
    _.each(group.children, item => {
      questions.push(_.merge(item.question, { group: group.question.id }));
    });
  });
  return questions;
};
