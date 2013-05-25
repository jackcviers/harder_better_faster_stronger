this["com"] = this["com"] || {};
this["com"]["github"] = this["com"]["github"] || {};
this["com"]["github"]["jackcviers"] = this["com"]["github"]["jackcviers"] || {};
this["com"]["github"]["jackcviers"]["harder_better_faster_stronger"] = this["com"]["github"]["jackcviers"]["harder_better_faster_stronger"] || {};

this["com"]["github"]["jackcviers"]["harder_better_faster_stronger"]["main"] = function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n  ";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</div>";
  return buffer;
  };