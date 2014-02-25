var _       = require('underscore'),
    builder = require('./builder'),
    _url    = require('url');

module.exports = function(schema) {
  return function handle(req, res) {
    var url  = _url.parse(req.url).pathname,
        defn = getDefn(url),
        link = getLink(req, url, defn);

    console.log('mephisto sees you seek ' + url);

    if (url === '/schema') {
      end(schema);
    } else if (!link) {
      end({ 'error': 'Not found' }, 404);
    } else {
      end(builder(url, schema, defn, link));
    }

    // writes the response body
    function end(body, statusCode) {
      statusCode || (statusCode = 200);
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(body))
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
    var i, link, matchesPath, matchesMethod;

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
