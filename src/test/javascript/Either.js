var global = global || window;
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var should = chai.should();
var _ = require('underscore');
var either = require('../../main/javascript/Either.js');
var Either = either.Either;
var Right = either.Right;
var Left = either.Left;
var RightProjection = either.RightProjection;
var LeftProjection = either.LeftProjection;
var conditionalToEither = either.conditionalToEither;
var negationToEither = either.negationToEither;
var left = either.left;
var right = either.right;

describe('Either', function(){
  beforeEach(function(done){
    this.leftInstance = left(1);
    this.rightInstance = right(1);
  });
  afterEach(function(done){
    this.leftInstance = this.rightInstance = {};
  });
  describe('#fold(leftMapperFunction, rightMapperFunction)', function(){
    it('should exist', function(done){
      expect(leftInstance.fold).to.exist
      done();
    });
    it('should be a function', function(done){
      leftInstance.fold.should.be.an.instanceof(Function);
      done();
    });
    it('should return the result of applying rightMapperFunction to the value of the instance if the instance is a Right', function(done){
      rightInstance.fold(function(num){ return "Incorrect!"}, function(num){ num + 1}).should.equal(2);
      done();
    });
    it('should return the result of applying leftMapperFunction to the value of the instance if the instance is a Left', function(done){
      leftInstance.fold(function(num) {return num + 1}, function(num){ return "Incorrect!"}).should.equal(2);
      done();
    });
  });
  describe('#left()', function(){
    it('should exist', function(done){
      expect(leftInstance.left.to.exist);
      done();
    });
    it('should be a Function', function(done){
      leftInstance.left.should.be.an.instanceof(Function);
      done();
    });
    it('should return a LeftProjection of a Left OR a Right', function(done){
      leftInstance.left().should.be.an.instanceof(LeftProjection);
      rightInstance.left().should.be.an.instanceof(LeftProjection);
      done();
    });
  });
  describe('#right', function(){
    it('should exist', function(done){
      expect(rightInstance.right).to.exist;
      done();
    });
    it('should be a Function', function(done){
      rightInstance.right.should.be.an.instanceof(Function);
      done();
    });
    it('should return a RightProjection of a Left OR a Right', function(done){
      leftInstance.right().should.be.an.instanceof(RightProjection);
      rightInstance.right().should.be.an.instanceof(RightProjection);
      done();
    });
  });
  describe('#swap()', function(){
    it('should exist', function(done){
      expect(leftInstance.swap).to.exist
      done();
    });
    it('should be a function', function(done){
      leftInstance.swap.should.be.an.instanceof(Function);
    });
    it('should turn a Right into a Left', function(done){
      var leftToRight = leftInstance.swap()
      leftToRight.should.be.an.instanceof(Right);
      leftToRight.get().should.equal(leftInstance.get());
    });
    it('should turn a Left into a Right', function(done){
      var rightToLeft = rightInstance.swap()
      rightToLeft.should.be.an.instanceof(Left);
      rightToLeft.get().should.equal(rightInstance.get());
    });
  });
  describe('#joinRight()', function(){
    it('should exist', function(done){
      expect(leftInstance.joinRight).to.exist
      done();
    });
    it('should be a Function', function(done){
      leftInstance.joinRight.should.be.an.instanceof(Function);
      done();
    });
    it('should return the wrapped value of a Right if the instance is a Right', function(done){
      rightInstance.joinRight().should.equal(rightInstance.value);
      done();
    });
    it('should return the wrapped value in a Left if the instance is a Left', function(done){
      leftInstance.joinRight().should.be.an.instanceof(Left);
      leftInstance.joinRight().get().should.equal(leftInstance.get());
      done();
    });
  });
  describe('#joinLeft()', function(){
    it('should exist', function(done){
      expect(leftInstance.joinLeft).to.exist
      done();
    });
    it('should be a function', function(done){
      leftInstance.joinLeft.should.be.an.instanceof(Function);
      done();
    });
    it('should return the wrapped value of a Left if the instance is a Left', function(done){
      leftInstance.joinLeft().should.equal(leftInstance.value);
      done();
    });
    it('should return the wrapped value in a Right if the instance is a Right', function(done){
      rightInstance.joinLeft().should.be.an.instanceof(Left);
      rightInstance.joinLeft().get().should.equal(rightInstance.get());
      done();
    });
  });
  describe('#merge()', function(){
    it('should exist', function(done){
      expect(rightInstance.merge).to.exist
      done();
    });
    it('should be a Function', function(done){
      rightInstance.merge.should.be.an.instanceof(Function);
    });
    it('should return the value in an array', function(done){
      var val = rightInstance.merge()
      val.should.be.an.instanceof(Array);
      val.should.deep.equal([rightInstance.get()]);
      done();
    });
  });
});

describe('Left', function(){
  beforeEach(function(done){
    this.instance = left(1);
    done();
  });
  afterEach(function(done){
    this.instance = {};
    done();
  });
  it('should exist', function(done){
    expect(Left).to.exist
    done();
  });
  it('should be a Function', function(done){
    Left.should.be.an.instanceof(Function);
    done();
  });
  describe('a Left instance', function(){
    it('should be a Left', function(done){
      new Left(1).should.be.an.instanceof(Left);
      done();
    });
    it('should be an Either', function(done){
      new Left(1).should.be.an.instanceof(Either);
      done();
    });
  });
  describe('#isRight()', function(){
    it('should exist', function(done){
      expect(this.instance).isRight.to.exist;
      done();
    });
    it('should be a Function', function(done){
      this.instance.isRight.should.be.an.instanceof(Function);
      done();
    });
    it('should return false', function(done){
      this.instance.isRight().should.be.false;
      done();
    });
  });
  describe('#isLeft()', function(){
    it('should exist', function(done){
      expect(this.instance.isLeft).to.exist;
      done();
    });
    it('should be a Function', function(done){
      this.instance.isLeft.should.be.an.instanceof(Function);
      done();
    });
    it('should return true', function(done){
      this.instance.isLeft().should.be.true;
      done();
    });
  });
});

describe('Right', function(){
  beforeEach(function(done){
    this.instance = new Right(1);
    done();
  });
  afterEach(Function(done){
    this.instance = {};
    done();
  });
  it('should exist', function(done){
    expect(Right).to.exist;
    done();
  });
  it('should be a Function', function(done){
    Right.should.be.an.instanceof(Function);
    done();
  });
  describe('a Right instance', function(){
    it('should be a Right', function(done){
      new Right(1).should.be.an.instanceof(Right);
      done();
    });
    it('should be an Either', function(done){
      new Right(1).should.be.an.instanceof(Either);
      done();
    });
  });
  describe('#isRight()', function(){
    it('should exist', function(done){
      expect(this.instance.isRight).to.exist;
      done();
    });
    it('should be a Function', function(done){
      this.instance.isRight.should.be.an.instanceof(Function);
      done();
    });
    it('should return true', function(done){
      this.instance.isRight.should.be.true;
      done();
    });
  });
  describe('#isLeft()', function(){
    it('should exist', function(done){
      expect(this.instance.isLeft).to.exist;
      done();
    });
    it('should be a Function', function(done){
      this.instance.isLeft.should.be.an.instanceof(Function);
      done();
    });
    it('should return false', function(done){
      this.instance.isLeft().should.be.false;
      done();
    });
  });
});

describe('LeftProjection', function(){
  beforeEach(function(done){
    this.leftInstance = new Left(1);
    this.rightInstance = new Right(1);
    this.leftProjectionOfLeft = this.leftInstance.left();
    this.leftProjectionOfRight = this.rightInstance.left();
    done();
  });
  afterEach(function(done){
    this.leftInstance = this.rightInstance = this.leftProjectionOfLeft = this.leftProjectionOfRight = {};
    done();
  });
  it('should exist', function(done){
    expect(LeftProjection).to.exist
    done();
  });
  it('should be a Function', function(done){
    LeftProjection.should.be.an.instanceof(Function);
    done();
  });
  describe('#every(predicate)', function(){
    it('should exist', function(done){
      expect(leftProjectionOfLeft.every).to.exist
      done();
    });
    it('should be a Function', function(done){
      leftProjectionOfLeft.every.should.be.an.instanceof(Function);
      done();
    });
    it('should return true if the either is a Right', function(done){
      leftProjectionOfRight.every(function(num){ return num > 3;}).should.be.true;
      done();
    });
    it('should return true if the either is a left and the predicate is true', function(done){
      leftProjectionOfLeft.every(function(num){ return num <= 1;}).should.be.true;
      done();
    });
    it('should return false if the either is a left and the predicate is false', function(done){
      leftProjectionOfLeft.every(function(num){ return num < 0;}).should.be.false;
      done();
    });
  });
  describe('#exists(predicate)', function(){
    it('should exist', function(done){
      expect(leftProjectionOfLeft.exists).to.exist;
      done();
    });
    it('should be a Function', function(done){
      leftProjectionOfLeft.exists.should.be.an.instanceof(Function);
      done();
    });
    it('should return false if the either is a Right', function(done){
      leftProjectionOfRight.exists(function(num){ return num > 0;}).should.be.false;
      done();
    });
    it('should return true if the either is a Left and the predicate is true', function(done){
      leftProjectionOfLeft.exists(function(num){ return num > 0;}).should.be.true;
      done();
    });
    it('should return false if the either is a Left and the predicate is false', function(done){
      leftProjectionOfLeft.exists(function(num){ return num < 0;}).should.be.false;
      done();
    });
  });
  describe('#flatmap(mapper)', function(){
    it('should exist', function(done){
      expect(leftProjectionOfLeft.flatmap).to.exist;
      done();
    });
    it('should be a Function', function(done){
      leftProjectionOfLeft.flatmap.should.be.an.instanceof(Function);
      done();
    });
    it('should return the either unchanged if the either is a Right', function(done){
      leftProjectionOfRight.flatmap(function(num){ return left(num * num); }).should.deep.equal(rightInstance);
      done();
    });
    it('should return the result of applying mapper to the extracted either value wrapped in an either instance if the eithe is a Left', function(done){
      var flatmapped = leftProjectionOfLeft.flatmap(function(num){ return left(num * num);});
      var leftInstanceValue = leftInstance.get();
      flatmapped.should.be.an.instanceof(Either);
      flatmapped.value.should.equal(leftInstanceValue * leftInstanceValue);
      done();
    });
  });
  describe('foreach(sideEffectingFunction)', function(){
    it('should exist', function(done){
      expect(leftProjectionOfLeft.foreach).to.exist;
      done();
    });
    it('should be a Function', function(done){
      leftProjectionOfLeft.foreach.should.be.an.instanceof(Function);
      done();
    });
    it('should apply the side-effecting function and return the result of it if the either is a left', function(done){
      leftProjectionOfLeft.foreach(function(num){ console.log('Woohoo!'); return 4;}).should.equal(4);
      done();
    });
    it('should not call the side effecter and return {} if the either is a Right', function(done){
      var spy = sinon.spy();
      leftProjectionOfRight.foreach(function(num){ spy(); return 4;}).should.equal({});
      spy.should.not.have.been.called;
      done();
    });
  });
  describe('#get()', function(){
    it('should exist', function(done){
      expect(leftProjectionOfLeft.get).to.exist;
      done();
    });
    it('should be a Function', function(done){
      leftProjectionOfLeft.get.should.be.an.instanceof(Function);
      done();
    });
    it('should return the unwrapped either value if the either is a Left', function(done){
      leftProjectionOfLeft.get().should.equal(this.leftInstance.get());
      done();
    });
    it('should throw a No such element error when the either is a Right', function(done){
      leftProjectionOfRight.get().should.throw;
      done();
    });
  });
  describe('#getOrElse(defaulter)', function(){
    it('should exist', function(done){
      expect(leftProjectionOfLeft.getOrElse).to.exist;
      done();
    });
    it('should be a Function', function(done){
      leftProjectionOfLeft.getOrElse.should.be.an.instanceof(Function);
      done();
    });
    it('should return the unwrapped either value if the either is a Left', function(done){
      leftProjectionOfLeft.getOrElse(function(){ return 0;}).should.equal(this.leftInstance.get());
      done();
    });
    it('should return the result of the defaulter function if the either is a Right', function(done){
      leftProjectionOfRight.getOrElse(function(){ return 0;}).should.equal(0);
      done();
    });
  });
});

describe('conditionalToEither(test, rightValue, leftValue)', function(){
  it('should exist', function(done){
    expect(conditionalToEither).to.exist;
    done();
  });
  it('should be a Function', function(done){
    conditionalToEither.should.be.an.instanceof(Function);
    done()
  });
  it('should return a Right if the test is true', function(done){
    conditionalToEither(true, 1, 2).should.be.an.instanceof(Right);
    done();
  });
  it('should return a Left if the test is false', function(done){
    conditionalToEither(false, 1, 2).should.be.an.instanceof(Left);
    done();
  });
});

describe('negationToEither(test, rightValue, leftValue)', function(){
  it('should exist', function(done){
    expect(negationToEither).to.exist;
    done();
  });
  it('should be a Function', function(done){
    negationToEither.should.be.an.instanceof(Function);
    done();
  });
  it('should return a Right if the test is false', function(done){
    negationToEither(false, 1, 2).should.be.an.instanceof(Right);
    done();
  });
  it('should return a Left if the test is true', function(done){
    negationToEither(true, 1, 2).should.be.an.instanceof(Left);
    done();
  });
});


describe('left', function(){
  beforeEach(function(done){
    this.instance = left(1);
    done();
  });
  afterEach(function(done){
    this.instance = {};
    done();
  });

  it('should exist', function(done){
    expect(left).to.exist
    done();
  });
  it('should be a function', function(done){
    left.should.be.an.instanceof(Function);
    done();
  });
  it('should return an Either instance', function(done){
    this.instance.should.be.an.instanceof(Either);
    done();
  });
  it('should return a Left instance', function(done){
    this.instance.should.be.an.instanceof(Left);
    done();
  });
});

describe('right', function(){
  beforeEach(function(done){
    this.instance = right(1);
    done();
  });
  afterEach(function(done){
    this.instance = {};
    done();
  });
});
