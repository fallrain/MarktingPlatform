/**
 * 说明：require加载资源的js
 * Created by wangguangkai on 2016/12/6.
 */

require.config({
  baseUrl: './',
  paths: {
    'jquery': 'js/app/jquery-1.11.0',
    'Common': 'js/app/common',
    'layer': 'js/layer-v3.0.1/layer',
    'jquery.validate': 'js/validation/jquery.validate',
    'validate': 'js/validation/validate',
    'urls': 'js/app/urls',
    'BeMarketing': 'js/frame/beMarketing',
    'beMarketingCtrl': 'js/frame/beMarketingCtrl',
  },
  shim: {
    'Common': {
      deps: ['jquery'],
      exports: 'Common'
    },
    'layer': {
      deps: ['jquery']
    },
    'jquery.validate': {
      deps: ['jquery']
    },
    'validate': {
      deps: ['Common', 'jquery.validate'],
      exports: 'validate'
    },
    'urls': {
      exports: 'urls'
    },
  }
});
require([
  'jquery',
  'Common',
  'layer',
  'jquery.validate',
  'validate',
  'urls',
  //'beMarketingCtrl'
]);
