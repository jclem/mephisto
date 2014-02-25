var steelToe = require('steelToe');

// returns an object in the schema for the given path
module.exports = function(schema, path) {
  path = path.slice(2);
  path = path.replace(/\//g, '.');
  return steelToe(schema).get(path);
};
