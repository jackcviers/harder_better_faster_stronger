var global = (typeof window !== 'undefined' && window != null) ? window : global;
var _ = require('underscore');
var when = require('when');
var TEMP = global.TEMPORARY;
var PERM = global.PERSISTENT;

function Either(value){
  this.value = value;
};
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
    return Left(this.value);
  }
  return Right(this.value);
};
Either.prototype.joinRight = function() {
  if(this.isRight()) {
    return this.value;
  }
  return Left(this.value);
};
Either.prototype.joinLeft = function() {
  if(this.isRight()) {
    return Right(this.value);
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
function Left(value){
  this.value = value;
};
Left.prototype = new Either();
Left.prototype.isRight = function() {
  return false;
};
Left.prototype.isLeft = function() {
  return true;
};
function Right(value){
  this.value = value;
};
Right.prototype = new Either();
Right.prototype.isRight = function () {
  return true;
};
Right.prototype.isLeft = funciton() {
  return false;
};
function LeftProjection(either) {
  this.either = either;
}
LeftProjection.prototype = {};
LeftProjection.prototype.every = function(predicate) {
  if(either.isRight()) {
    return true;
  }
  return predicate(either.value);
};
LeftProjection.prototype.exists = function(predicate) {
  if(either.isRight()) {
    return false;
  }
  return predicate(either.value);
};
LeftProjection.prototype.flatmap = function(mapper){
  var mappedValue;
  if(either.isRight()){
    return either;
  }
  mappedValue = mapper(either.value);
  if(!(mappedValue instanceof Either)) {
    return new Left(mappedValue);
  } else if(mappedValue instanceof Right) {
    return new Left(mappedValue);
  } else {
    return mappedValue;
  }
};
LeftProjection.prototype.foreach = function(sideEffecter) {
  if(either.isLeft()) {
    return sideEffecter(either.value);
  }
  return {};
};
LeftProjection.prototype.get = function() {
  if(either.isLeft()) {
    return either.value;
  }
  throw new Error('No such element.');
};
LeftProjection.prototype.getOrElse = function(defaulter) {
  if(either.isLeft()) {
    return either.value;
  }
  return defaulter();
};
LeftProjection.prototoype.map = function(mapper) {
  if(either.isRight()){
    return either;
  }
  return new Left(mapper(either.value));
};
function RightProjection(either) {
  this.either = either;
};
LeftProjection.prototype = {};
RightProjection.prototype.every = function(predicate) {
  if(either.isLeft()) {
    return true;
  }
  return predicate(either.value);
};
RightProjection.prototype.exists = function(predicate) {
  if(either.isLeft()){
    return false;
  }
  return predicate(either.value);
};
RightProjection.prototype.flatmap = function(mapper){
  var mappedValue;
  if(either.isLeft()){
    return either;
  }
  mappedValue = mapper(either.value);
  if(!(mappedValue instanceof Either)) {
    return new Right(mappedValue);
  } else if(mappedValue instanceof Left) {
    return new Right(mappedValue);
  } else {
    return mappedValue;
  }
};
RightProjection.prototype.foreach = function(sideEffecter) {
  if(either.isRight()) {
    return sideEffecter(either.value);
  }
  return {};
};
RightProjection.prototype.get = function() {
  if(either.isRight()) {
    return either.value
  }
  throw new Error('No such element.');
};
RightProjection.prototype.getOrElse = function(defaulter) {
  if(either.isRight()){
    return either.value;
  }
  return defaluter();
};
RightProjection.prototoype.map = function(mapper) {
  if(either.isLeft()){
    return either;
  }
  return new Left(mapper(either.value));
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
