var global = (typeof window !== 'undefined' && window != null) ? window : global;
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var visualization = require('../../../tmp/templates.js').visualization;
var webkitRequestAnimationFrame = global.webkitRequestAnimationFrame;
var Uint8Array = global.Uint8Array;
var Visualization = Backbone.View.extend({
  analyzer: null,
  render: function(){
    this.$el.html(this.template());
    return this;
  },
  startAnimation: function(){
    this.render();
    var canvas = this.$(".visualization-context" ,this.$el).get()[0];
    this.gfx = canvas.getContext('2d');
    window.webkitRequestAnimationFrame(_.bind(this.update, this));
  },
  update: function(){
    var w = 800;
    var h = 600;
    var buffer1 = null;
    var buffer2 = null;
    var rtick = 0;
    var gtick = 0;
    var btick = 0;
    webkitRequestAnimationFrame(_.bind(this.update, this));
    if(!buffer1) {
        //console.log('creating');
        buffer1 = document.createElement("canvas");
        buffer1.width = w;
        buffer1.height = h;
        
        buffer2 = document.createElement("canvas");
        buffer2.width = w;
        buffer2.height = h;
    }

    var bctx1 = buffer1.getContext('2d');
    var bctx2 = buffer2.getContext('2d');
    
    //copy buffer1 to buffer2
    bctx2.drawImage(buffer1,0,0);
    

    //get sound data
    var data = new Uint8Array(512);
    this.analyzer.getByteFrequencyData(data);

    //draw music into buffer 2
    bctx2.fillStyle = "red";
    //bctx2.fillRect(50,50,100,100);
    rtick = (rtick+1)%255;
    gtick = (gtick+2)%255;
    btick = (btick+3)%255;
    bctx2.strokeStyle = "rgb("+rtick+","+gtick+","+btick+")";
    bctx2.beginPath();
    
    var s = data.length/2*4;
    
    var l = w/2-s/2;
    var t = h/2-256/2;
    bctx2.moveTo(l, t+128-data[0]+100);
    
    for(var i=0; i<data.length/2; i++) {
        bctx2.lineTo(      l+i*4, t+128-data[i]+100);
    }
    
    for(i=(data.length/2)-1; i>=0; i--) {
        var max = data.length/2-1;
        bctx2.lineTo(l+(max-i)*4, t+128-data[i]+100);
    }
    bctx2.stroke();
    
    //copy buffer2 to buffer1, stretched
    //draw more onto buffer
    bctx1.drawImage(buffer2, 0,0,w,h,  -5,-5, w+10,h+10);
    //draw buffer1 back to screen
    this.gfx.drawImage(buffer1,0,0);
  },
  template: visualization
});

module.exports = Visualization;
