"use strict";

var redis = require("redis");
var client = redis.createClient();

exports.redis = function(){
  return client;
}
