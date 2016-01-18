var path = require('path')
  , expect = require('chai').expect
  , mdp = require('../../lib/mdp')
  , pkg = path.normalize(path.join(__dirname, '..', '..', 'package.json'));

describe('mdp:', function() {

  it('should create program', function(done) {
    var program = mdp(pkg);
    expect(program).to.be.an('object');
    //console.dir(program);
    done();
  });

})
