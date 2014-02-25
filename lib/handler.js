var _       = require('underscore'),
    builder = require('./builder');

module.exports = function(schema) {
  return function handle(req, res) {
    var url      = req.url,
        defn     = getDefn(url),
        link     = getLink(req, url, defn),
        body;

    if (!link) {
      res.statusCode = 404;
      res.end();
    } else {
      body = builder(url, schema, defn, link);
      body = JSON.stringify(body);
      res.end(body);
    }
  }

  // finds the resource definition for the given url
  function getDefn(url) {
    var defn, key, paths, path;

    for (key in schema.definitions) {
      defn  = schema.definitions[key];
      paths = getDefnLinkPaths(defn);
      path  = _.find(paths, function(path) {
        return matchPath(url, path);
      });

      if (path) return defn;
    }
  }

  // returns all link paths for the given resource definition
  function getDefnLinkPaths(defn) {
    return _.map(defn.links, function(link) {
      return link.href;
    });
  }

  // finds the link for the given url and resource definition
  function getLink(req, url, defn) {
    var i, link, match;

    if (!defn) return undefined;

    for (i in defn.links) {
      link          = defn.links[i];
      matchesPath   = matchPath(url, link.href);
      matchesMethod = req.method.toUpperCase() === link.method;
      if (matchesPath && matchesMethod) return link;
    }
  }

  // returns whether or not url matches given path
  function matchPath(url, path) {
    var rawRegex, regex;

    rawRegex = path.replace(/{[^\/]+}/g, '[\\w-]+');
    rawRegex = '^' + rawRegex + '$';
    regex    = new RegExp(rawRegex);

    return url.match(regex);
  }
};
