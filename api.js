var redisClient = require("./lib/redis").redis();
var urlValidator = require("./lib/url-validator");
var app = require("express")();

var generateId = function(){ return parseInt(Math.random() * 1000, 10).toString(); }

app.use(function (req, res, next) {
  if(req.path !== '/short') return next();
  if(!urlValidator.valid(req.query.url)) return res.status(422).send('Invalid request');

  next();
})

app.post('/short',function(r,_r){
  var id = generateId();
  redisClient.set(id, r.query.url, function(e,v){
    if(e) return res.status(500).send('Opss.. Something happened.');
  });
  _r.send(id);
});

app.get('/:id',function(r,_r){
  redisClient.get(r.params.id, function(e, v){
    if(e) return res.status(500).send('Opss.. Something happened.');
    _r.redirect(301, v);
  });
});

var server = app.listen(4000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
