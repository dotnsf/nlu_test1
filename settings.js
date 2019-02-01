exports.nlu_apikey = '';
exports.nlu_url = '';
exports.app_port = 0;

if( process.env.VCAP_SERVICES ){
  var VCAP_SERVICES = JSON.parse( process.env.VCAP_SERVICES );
  if( VCAP_SERVICES && VCAP_SERVICES.natural_language_understanding ){
    exports.nlu_apikey = VCAP_SERVICES.natural_language_understanding[0].credentials.apikey;
    exports.nlu_url = VCAP_SERVICES.natural_language_understanding[0].credentials.url;
  }
}

