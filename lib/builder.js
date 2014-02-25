var ref = require('./ref');

module.exports = function(url, schema, defn, link) {
  var urlProperties = getURLProperties(url, link.href),
      properties    = resolveProperties(defn.properties);

  if (link.rel === 'self') {
    return properties;
  } else if (link.rel === 'instances') {
    return [properties];
  }

  // returns an object with schema refs as keys and values from the request
  // path as values
  function getURLProperties(url, href) {
    var result = {},
        hrefSegments, urlSegments;

    url          = decodeURIComponent(url);
    urlSegments  = url.split('/');
    hrefSegments = href.split('/');

    hrefSegments.forEach(function(segment, i) {
      if (segment.match(/{(.+)}/)) {
        segment = decodeURIComponent(segment);
        segment = segment.replace(/[{()}]/g, '');

        // FIXME: 'name' isn't an identity property for all resources
        segment = segment.replace(/identity$/, 'name');

        result[segment] = urlSegments[i];
      }
    });

    return result;
  }

  // return an object of property keys and example values
  function resolveProperties(properties) {
    var result = {},
        key, property, propertyDefn;

    for (key in properties) {
      property = properties[key];

      if (property.properties) {
        result[key] = resolveProperties(property.properties);
      } else if (urlProperties[property.$ref]) {
        result[key] = urlProperties[property.$ref];
      } else {
        propertyDefn = ref(schema, property.$ref);
        result[key] = propertyDefn.example;
      }
    }

    return result;
  }
};
