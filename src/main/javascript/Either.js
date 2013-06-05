var global = (typeof window !== 'undefined' && window != null) ? window : global;
var _ = require('underscore');
var when = require('when');
var TEMP = global.TEMPORARY;
var PERM = global.PERSISTENT;
function Left(value){
  this.value = value;
}
function Right(value){
  this.value = value;
}
function Either(value){
  this.value = value;
}
function LeftProjection(either) {
  this.either = either;
}
function RightProjection(either) {
  this.either = either;
}

Either.prototype = {};
Either.prototype.fold = function( leftMapper, rightMapper) {
  if(this.isRight()){
    return rightMapper(this.value);
  }else{
    return leftMapper(this.value);
  }
};
Either.prototype.swap = function() {
  if(this.isRight()) {
    return new Left(this.value);
  }
  return new Right(this.value);
};
Either.prototype.joinRight = function() {
  if(this.isRight()) {
    return this.value;
  }
  return new Left(this.value);
};
Either.prototype.joinLeft = function() {
  if(this.isRight()) {
    return new Right(this.value);
  }
  return this.value;
};
Either.prototype.left = function () {
  return new LeftProjection(this);
};
Either.prototype.right = function () {
  return new RightProjection(this);
};
Either.prototype.merge = function() {
  return [this.value];
};
Either.prototype.isLeft = function() {
  throw new Error('Either is abstract');
};
Either.prototype.isRight = function(){
  throw new Error('Either is abstract');
};
Left.prototype = new Either();
Left.prototype.isRight = function() {
  return false;
};
Left.prototype.isLeft = function() {
  return true;
};
Right.prototype = new Either();
Right.prototype.isRight = function () {
  return true;
};
Right.prototype.isLeft = function() {
  return false;
};
LeftProjection.prototype = {};
LeftProjection.prototype.every = function(predicate) {
  if(this.either.isRight()) {
    return true;
  }
  return predicate(this.either.value);
};
LeftProjection.prototype.exists = function(predicate) {
  if(this.either.isRight()) {
    return false;
  }
  return predicate(this.either.value);
};
LeftProjection.prototype.flatmap = function(mapper){
  var mappedValue;
  if(this.either.isRight()){
    return this.either;
  }
  mappedValue = mapper(this.either.value);
  if(!(mappedValue instanceof Either)) {
    throw new TypeError("mapper must return an either in flatmap.");
  }
  return mappedValue;
};
LeftProjection.prototype.foreach = function(sideEffecter) {
  if(this.either.isLeft()) {
    return sideEffecter(this.either.value);
  }
  return {};
};
LeftProjection.prototype.get = function() {
  if(this.either.isLeft()) {
    return this.either.value;
  }
  throw new Error('No such element.');
};
LeftProjection.prototype.getOrElse = function(defaulter) {
  if(this.either.isLeft()) {
    return this.either.value;
  }
  return defaulter();
};
LeftProjection.prototype.map = function(mapper) {
  if(this.either.isRight()){
    return this.either;
  }
  return new Left(mapper(this.either.value));
};
RightProjection.prototype = {};
RightProjection.prototype.every = function(predicate) {
  if(this.either.isLeft()) {
    return true;
  }
  return predicate(this.either.value);
};
RightProjection.prototype.exists = function(predicate) {
  if(this.either.isLeft()){
    return false;
  }
  return predicate(this.either.value);
};
RightProjection.prototype.flatmap = function(mapper){
  var mappedValue;
  if(this.either.isLeft()){
    return this.either;
  }
  return mapper(this.either.value);
};
RightProjection.prototype.foreach = function(sideEffecter) {
  if(this.either.isRight()) {
    return sideEffecter(this.either.value);
  }
  return {};
};
RightProjection.prototype.get = function() {
  if(this.either.isRight()) {
    return this.either.value;
  }
  throw new Error('No such element.');
};
RightProjection.prototype.getOrElse = function(defaulter) {
  if(this.either.isRight()){
    return this.either.value;
  }
  return defaulter();
};
RightProjection.prototype.map = function(mapper) {
  if(this.either.isLeft()){
    return this.either;
  }
  return new Right(mapper(this.either.value));
};
module.exports = {
  Either: Either,
  Left: Left,
  Right: Right,
  LeftProjection: LeftProjection,
  RightProjection: RightProjection,
  conditionalToEither: function(test, rightValue, leftValue) {
    if(test){
      return new Right(rightValue);
    }
    return new Left(leftValue);
  },
  negationToEither: function(test, rightValue, leftValue) {
    if(test){
      return new Left(leftValue);
    }
    return new Right(rightValue);
  },
  left: function(value){
    return new Left(value);
  },
  right: function(value) {
    return new Right(value);
  }
};
