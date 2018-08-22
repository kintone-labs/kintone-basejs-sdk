/**
 * kintone api - nodejs client
 * App models
 */

const AppModels = {
  // TODO: Write unit test
  GetAppRequest: require('./app/GetAppRequest'),
  // TODO: Write unit test
  GetAppsRequest: require('./app/GetAppsRequest'),
  AddPreviewAppRequest: require('./app/AddPreviewAppRequest'),
  // TODO: Write unit test
  GetFormFieldsRequest: require('./form/GetFormFieldsRequest'),
  // TODO: Write unit test
  GetFormLayoutsRequest: require('./form/GetFormLayoutRequest'),
};
module.exports = AppModels;
