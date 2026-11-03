const APJS = require('./amazingpro');

"use strict";
Object.defineProperty(exports, '__esModule', {value: true});
exports.output = exports.input = exports.component = exports.customNode = void 0;
function customNode() {
  return target => {
    //console.log('@customNode is Used');
  };
}
exports.customNode = customNode;
function component(optionalParams) {
  return target => {
    APJS.UserScriptComponentUtils.registerUserComponent(target, optionalParams);
  };
}
exports.component = component;
//property decoration
// Graph Input Port
function input(type) {
  return (target, key) => {
    //console.log('@input with param ' + type);
  };
}
exports.input = input;

// Graph Output Port
function output(type) {
  return (target, key) => {
    //console.log('@output with param ' + type);
  };
}
exports.output = output;

// SerializeSceneObjectFlag Decorator. Flag the property's type is 'APJS.SceneObject'.
function serializeSceneObjectFlag(target, key) {
  APJS.addSceneObjectProperty(target.constructor, key);
}
exports.serializeSceneObjectFlag = serializeSceneObjectFlag;

// SerializeProperty Decorator
function serializeProperty(target, key) {
  if (target && key) {
    // Support `@serializeProperty`
    APJS.serialize(target, key);
  } else {
    // Support `@serializeProperty()`
    return (target, key) => {
      APJS.serialize(target, key);
    };
  }
}
exports.serializeProperty = serializeProperty;

function passV1() {return (target, key) => {};}
function passV2(target, key) { if(target && key) {} else {return (target, key) => {};}}
exports.label = passV1;
exports.readOnly = passV2;
exports.slider = passV1;
exports.spinBox = passV1;
exports.dropDown = passV1;
exports.textArea = passV1;
exports.header = passV1;
exports.showIf = passV1;
exports.tooltip = passV1;
exports.separator = passV2;
exports.space = passV1;
exports.groupBegin = passV1;
exports.groupEnd = passV2;
exports.disablePin = passV2;

