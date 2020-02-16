const graphQL = require('./graphQL');
const Compare = require('./compare');

const utils = {

  /**
   * returns a matching interaction
   * @param {object} req - req object
   * @param {Map<string, object>} interactions - interactions
   */
  getMatchingInteraction(req, interactions) {
    const ids = Array.from(interactions.keys());
    for (let i = ids.length - 1; i >= 0; i--) {
      const interaction = interactions.get(ids[i]);
      const isValidMethod = (interaction.withRequest.method === req.method);
      if (!isValidMethod) {
        continue;
      }
      const isValidPath = (interaction.withRequest.path === req.path);
      if (!isValidPath) {
        continue;
      }
      let isValidQuery = true;
      if (!interaction.withRequest.ignoreQuery) {
        if (Object.keys(req.query).length > 0 || interaction.withRequest.query) {
          isValidQuery = validateQuery(req.query, interaction.withRequest.query, interaction.withRequest.matchingRules);
        }
      }
      if (!isValidQuery) {
        continue;
      }
      let isValidHeaders = true;
      if (interaction.withRequest.headers) {
        isValidHeaders = validateHeaders(req.headers, interaction.withRequest.headers);
      }
      let isValidBody = true;
      if (!interaction.withRequest.ignoreBody) {
        if (interaction.withRequest.graphQL) {
          isValidBody = graphQL.compare(req.body, interaction.withRequest.body);
        } else {
          if (typeof req.body === 'object') {
            if (Object.keys(req.body).length > 0) {
              isValidBody = validateBody(req.body, interaction.withRequest.body, interaction.withRequest.matchingRules);
            }
          } else if (req.body) {
            isValidBody = validateBody(req.body, interaction.withRequest.body, interaction.withRequest.matchingRules);
          }
        }
      }
      if (isValidMethod && isValidPath && isValidQuery && isValidHeaders && isValidBody) {
        return interaction;
      }
    }
    return null;
  }

};

function validateQuery(actual, expected, matchingRules) {
  if (typeof actual !== 'object' || typeof expected !== 'object') {
    return false;
  }
  const compare = new Compare();
  const response = compare.jsonMatch(actual, expected, matchingRules, '$.query');
  if (response.equal) {
    return compare.jsonMatch(expected, actual, matchingRules, '$.query').equal;
  } else {
    return response.equal;
  }
}

function validateHeaders(actual, expected) {
  for (const prop in expected) {
    if (!Object.prototype.hasOwnProperty.call(expected, prop.toLowerCase())) {
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(actual, prop.toLowerCase())) {
      return false;
    }
    if (expected[prop] != actual[prop.toLowerCase()]) {
      return false;
    }
  }
  return true;
}

function validateBody(actual, expected, matchingRules) {
  const compare = new Compare();
  const response = compare.jsonMatch(actual, expected, matchingRules, '$.body');
  if (response.equal) {
    return compare.jsonMatch(expected, actual, matchingRules, '$.body').equal;
  } else {
    return response.equal;
  }
}

module.exports = utils;