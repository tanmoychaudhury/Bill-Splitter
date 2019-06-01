'use strict';
const async =require('async');
const logger = global.local_require('/utils/logger');

const api = 'App start :';
const file = 'startup.appstart';

var exports = module.exports = {};

exports.load_app_settings = function (){
    const func = '.load_app_settings';
    async.series({
    },function(error,data){
        if(!error){
            logger.info('Application settings load completed.')
        }else{
            logger.error(api+file+func+': Error in loading Application settings, please contact support.');    
            logger.debug(error);
      }
    })
}


