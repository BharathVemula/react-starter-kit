import UrlStore from './urlShortner.model';
import config from '../../config';

const Base58 = require('base58');

let baseUrl = config.baseUrl;
if (config.env !== 'production') {
  baseUrl = `${baseUrl}:${config.port}`;
}

export async function shorten(req, res) {
  const longUrl = req.body.url;
  let shortUrl = '';

  // Finding the urlId
  let lastId = 1;
  const lastDoc = await UrlStore.find({}).sort({ urlId: -1 }).limit(1);
  console.error(lastDoc);
  if (lastDoc.length !== 0) lastId = lastDoc[0].urlId + 1;

  // Inserting the Url into the database.
  if (!longUrl) {
    res.json({
      message: '[paramter missing]require a paramter url in request body',
    });
  } else {
    // check if url already exists in database
    UrlStore.findOne({ longUrl }, (err, doc) => {
      if (doc) {
        // base58 encode the unique _id of that document and construct the short URL
      shortUrl = baseUrl + '/' + Base58.encode(doc.urlId); // eslint-disable-line

        // since the document exists, we return it without creating a new entry
        res.json({ shortUrl });
      } else {
        // The long URL was not found in the long_url field in our urls
        // collection, so we need to create a new entry:
        const urlsArr = [
          {
            longUrl,
          },
        ];

        UrlStore.create(urlsArr).then(docs => {
          if (docs.length) {
            const encodeStr = Base58.encode(lastId);
          shortUrl = baseUrl + '/' +encodeStr; //eslint-disable-line
            UrlStore.update(
              {
                longUrl,
              },
              {
                urlId: lastId,
                activeRecord: true,
                shortUrl: encodeStr,
              },
            )
              .exec()
              .then(doc => { //eslint-disable-line
                if (doc.n === 1) {
                  res.json({ shortUrl, Insertion: 'success' });
                } else {
                  UrlStore.remove({ longUrl }).exec(); // If the updation falied remove the record inserted
                  res.json({ Insertion: 'falied' });
                }
              });
          } else {
            res.json({ insertion: 'falied' });
          }
        });
      }
    });
  }
}

export function deleteRecord(req, res) {
  const shortUrl = req.body.url;
  if (!shortUrl) {
    res.json({
      message: '[paramter missing]require a paramter url in request body',
    });
  } else {
    const shortUrlIndex = shortUrl.replace(`${baseUrl}/`, '');
    UrlStore.update(
      { shortUrl: shortUrlIndex, deleted: false },
      { deleted: true },
    )
      .exec()
      .then(docs => {
        if (docs.n === 1) {
          res.json({ delete: 'success', msg: '' });
        } else {
          res.json({ delete: 'failue', msg: 'No such url exists' });
        }
      });
  }
}

export default { shorten, deleteRecord };
