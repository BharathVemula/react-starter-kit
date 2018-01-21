/**
 *@description
 *    This File contains the Mongoose Schema defined for url shortner
 * @Author :
 *    Bharath Vemula
 * version
 *    1.0.0
 */
const mongoose = require('mongoose');
// const autoIncrement = require('mongoose-auto-increment');

const urlStoreSchema = new mongoose.Schema({
  urlId: { type: Number },
  shortUrl: { type: String },
  longUrl: { type: String },
  deleted: { type: Boolean, default: false },
  type: { type: String },
  activeRecord: { type: Boolean, default: false },
  UpadationTime: { type: Date, default: Date.now },
});

// urlStoreSchema.plugin(autoIncrement.plugin, {
//   model: 'UrlStore',
//   field: 'urlId',
//   startAt: 0,
//   incrementBy: 1,
// });

export default mongoose.model('UrlStore', urlStoreSchema);
