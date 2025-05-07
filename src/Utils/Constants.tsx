export const API_ENDPOINTS = {
  TOKEN_GET : "token",

  USER_CURRENT : "User/User",
  USER_ROLES : "User/Roles",

  STATS_SITE_NBR_CAMERA:"Statistics/Sites/#id_site#/Cameras",
  STATS_SITE_NBR_CAMERA_OK:"Statistics/Sites/#id_site#/CamerasStateOk",
  STATS_SITE_NBR_CAMERA_KO:"Statistics/Sites/#id_site#/CamerasStateKo",
  STATS_SITE_NBR_ARCHIVER:"Statistics/Sites/#id_site#/ArchiverCameras",
  STATS_SITE_NBR_CAMERA_REQUEST_INTEGRATION:"Statistics/Sites/#id_site#/RequestCameraIntegrationRequest",
  STATS_SITE_NBR_CAMERA_INTEGRATION:"Statistics/Sites/#id_site#/RequestCameraInItegration",
  STATS_SITE_NBR_LICENCE:"Statistics/Sites/#id_site#/LicenseTotal",
  STATS_SITE_NBR_LICENCE_USED:"Statistics/Sites/#id_site#/LicenseUsed",
  STATS_SITE_NBR_LICENCE_POOL:"Statistics/Sites/#id_site#/LicensePool",
  STATS_SITE_NBR_LICENCE_POOL_OPEN:"Statistics/Sites/#id_site#/LicensePoolOpen",
  STATS_SITE_NBR_LICENCE_COMMAND:"Statistics/Sites/#id_site#/LicenseCommand",
  STATS_SITE_NBR_LICENCE_COMMAND_INVOICED:"Statistics/Sites/#id_site#/LicenseCommandInvoiced",

  STATS_SERVICE_NBR_CAMERA:"Statistics/Services/#id_service#/CameraForService",
  STATS_SERVICE_NBR_LICENCE:"Statistics/Services/#id_service#/LicenseForService",

  SITE_GET_SERVICES:"Services/Sites/#id_site#",
  SITE_GET_ARCHIVERS:"Archivers/Sites/#id_site#",
  SITE_GET_REQUEST_LIGHTS:"Requests/Sites/#id_site#",
  SITE_GET_REQUEST_CAMERA_LIGHT:"RequestCameras/Sites/#id_site#",
  SITE_GET_CAMERAS:"Cameras/Sites/#id_site#",
  SITE_GET_DELETE_REQUESTS:"DeleteRequests/Sites/#id_site#",
  SITE_GET_TREE_STRUCTURES:"TreeStructures/Sites/#id_site#",
  SITE_GET_LICENCE_POOL:"LicensePools/Sites/#id_site#",
  
  CAMERA_GET_VIDEO_STREAMS:"VideoStreams/Sites/#id_site#/videostreams",
  CAMERA_GET_ALL:"Cameras",
  CAMERA_GET_SNAPSHOT:"Cameras/Sites/#id_site#/Camerasnapshot/#guid_camera#",

  DELETE_REQUEST_POST:"DeleteRequests",
  DELETE_REQUEST_DELETE:"DeleteRequests?siteId=#id_site#&id=#id_deleteRequest#",

  RENAME_CAMERA_GET_ALL:"RenameCamera",
  RENAME_CAMERA_POST:"RenameCamera",

  USER_GROUP_GET_ALL:"User/UserGroup",
  USER_GROUP_PUT:"User/UserGroup/#id_user_group#",
  USER_GROUP_POST:"User/UserGroup",
  USER_GROUP_DELETE:"User/UserGroup/#id_user_group#",

  REQUEST_GET_ALL:"Requests",

  ADD_REQUEST_GET:"AddRequests/#id_request#",
  ADD_REQUEST_POST:"AddRequests",
  ADD_REQUEST_DELETE:"AddRequests/#id_request#",
  ADD_REQUEST_PUT:"AddRequests/#id_request#",

  REPLACE_REQUEST_GET:"ReplaceRequests/#id_request#",
  REPLACE_REQUEST_POST:"ReplaceRequests",
  REPLACE_REQUEST_DELETE:"ReplaceRequests/#id_request#",
  REPLACE_REQUEST_PUT:"ReplaceRequests/#id_request#",
  

  USER_ROLE_GET_ALL:"User/Roles",

  SITE_GET_ALL:"Sites",

  CAMERA_MODEL_GET_ALL:"Cameras/CameraModels",

  CAMERA_USAGE_GET_ALL:"Usages",

  SERVICE_GET_LICENCE_POOLS:"LicensePools/Services/#id_service#",

  LICENCE_POOL_POST:"LicensePools",
  LICENCE_POOL_PUT:"LicensePools/#id_licence_pool#",
  LICENCE_POOL_DELETE:"LicensePools/#id_licence_pool#",
  LICENCE_POOL_GET: "LicensePools/#id_licence_pool#",
  LICENCE_POOL_POST_LICENCE: "Licenses/LicensePools/#id_licence_pool#",

  LICENCE_PUT:"Licenses/#id_licence#"
};
export const PATH = {
  IMAGE:'/src/assets/image'
}