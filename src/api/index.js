/**
 * API
 */

const urlShortner = require('./urlShortner');

export default function(app) {
  //  Insert API below
  app.use('/api/urlShortner', urlShortner);
}
