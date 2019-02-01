// app.js

var bodyParser = require( 'body-parser' );
var cfenv = require( 'cfenv' );
var express = require( 'express' );
var fs = require( 'fs' );
var multer = require( 'multer' );
var os = require( 'os' );
//var request = require( 'request' );
var uuidv1 = require( 'uuid/v1' );
var nluv1 = require( 'watson-developer-cloud/natural-language-understanding/v1' );

var app = express();

var settings = require( './settings' );
var appEnv = cfenv.getAppEnv();

var nlu = null;
if( settings.nlu_apikey ){
  var url = ( settings.nlu_url ? settings.nlu_url : 'https://gateway.watsonplatform.net/natural-language-understanding/api/' );
  nlu = new nluv1({
    iam_apikey: settings.nlu_apikey,
    version: '2018-03-19',
    url: url
  });
}

app.use( express.static( __dirname + '/public' ) );
app.use( multer( { dest: './tmp/' } ).single( 'file' ) );
app.use( bodyParser.urlencoded( { extended: true }) );  //. body-parser deprecated undefined extended
app.use( bodyParser.json() );

app.get( '/', function( req, res ){
  res.write( JSON.stringify( { status: true } ) );
  res.end();
});

app.post( '/nlu', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var text = req.body.text;
  if( text ){
    nlu.analyze({
      html: text,
      features: {
        categories: {},
        entities: {},
        concepts: {},
        //emotion: {},  //. 日本語未サポート
        sentiment: {},
        keywords: {}
      }
    }, function( err0, res0 ){
      if( err0 ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, error: err0 } ) );
        res.end();
      }else{
        res.write( JSON.stringify( { status: true, result: res0 } ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'parameter text is blank.' }, 2, null ) );
    res.end();
  }
});


var port = settings.app_port || appEnv.port || 3000;
app.listen( port );
console.log( 'server started on ' + port );
