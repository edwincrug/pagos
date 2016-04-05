var env = process.env.NODE_ENV || 'production',
    express = require('express'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    middlewares = require('./middlewares/admin'),
    router = require('./website/router');


var ExpressServer = function(config){
    this.config = config || {};

    this.expressServer = express();

    // middlewares
    this.expressServer.use(bodyParser.urlencoded({extended: true}))
    for (var middleware in middlewares){
        this.expressServer.use(middlewares[middleware]);
    }

    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/website/views/templates');
    swig.setDefaults({varControls:['[[',']]']});

    if(env == 'development'){
        console.log('OK NO HAY CACHE');
        this.expressServer.set('view cache', false);
        swig.setDefaults({cache: false, varControls:['[[',']]']});
    }

    for (var controller in router){
        for (var funcionalidad in router[controller].prototype){
            var method = funcionalidad.split('_')[0];
            var entorno = funcionalidad.split('_')[1];
            var data = funcionalidad.split('_')[2];
            data = (method == 'get' && data !== undefined) ? ':data' : '';
            var url = '/api/' + controller + '/' + entorno + '/' + data;
            this.router(controller,funcionalidad,method,url);
        }
    } 

    this.expressServer.get('/hola', function(req, res){
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('Hola, Mundo!');
        res.end();
    });

    //Servimos el archivo angular
    this.expressServer.get('/', function(req, res){
        res.sendfile('app/static/index.htm');
    });

    //Recibo las variables de login
    this.expressServer.post('*', function(req, res){
        res.sendfile('app/static/index.htm');
    });

};

ExpressServer.prototype.router = function(controller,funcionalidad,method,url){
    console.log(url);
    var cnn = this.config.connection;

    this.expressServer[method](url, function(req,res,next){
       var conf = {
           'funcionalidad':funcionalidad,
           'req': req,
           'res': res,
           'next': next,
           'connection' : cnn
       } 
       var Controller = new router[controller](conf);
       Controller.response();
    });
}
module.exports = ExpressServer;