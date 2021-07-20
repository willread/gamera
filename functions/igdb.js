const admin = require('firebase-admin');
const functions = require('firebase-functions');
const axios = require('axios');

const MAX_FIRESTORE_BATCH_SIZE = 500;

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

function getToken() {
  const path = `https://id.twitch.tv/oauth2/token?client_id=${functions.config().igdb.id}&client_secret=${functions.config().igbd.secret}&grant_type=client_credentials`;

  return axios({
    url: path,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  })
  .then(function(r) {
    return r.data;
  })
  .catch(function(e) {
    reject(e);
  });
}

function revokeToken(token) {
  const path = `https://id.twitch.tv/oauth2/revoke?client_id=${functions.config().igdb.id}&token=token`;

  return axios({
    url: path,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  })
  .then(function(r) {
    return r.data;
  })
  .catch(function(e) {
    reject(e);
  });
}

async function fetchPageOfGames(token, limit, offset) {
  const fields = ['category', 'cover.*', 'first_release_date', 'genres', 'keywords.*', 'name', 'platforms', 'screenshots.*', 'summary', 'version_title'];
  const path = `https://api.igdb.com/v4/games?limit=${limit}&offset=${offset}&fields=${fields.join(',')}`;

  return await axios({
    url: path,
    method: 'GET',
    headers: {
      'Client-ID': functions.config().igdb.id,
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    },
  })
  .then(async function(r) {
    return(r.data.map(game => {
      if (game.cover) {
        game.cover.url = game.cover.url.replace('/t_thumb/', '/t_cover_big/');
      }
      if (game.screenshots) {
        game.screenshots = game.screenshots.map(s => s.url = s.url.replace('/t_thumb/', '/t_screenshot_big/'));
      }

      return game;
    }));
  })
  .catch(function(e) {
    throw(e);
  });
}

exports.fetchGames = functions.https.onRequest(async (request, response) => {
  try {
    const token = await getToken();

    const limit = 500;
    const maxOffset = 10000;
    const waitTime = 1000;
    let offset = 0;
    let done = false;
    const searchIndex = [];

    while (!done) {
      const games = await fetchPageOfGames(token, limit, offset);

      if (!games || !games.length) {
        done = true;
      } else {
        const batch = db.batch();

        games.forEach(game => {
          const { id, ...data } = game;
          db.collection('games').doc(id.toString()).set(data);

          searchIndex.push({
            id,
            name: game.name,
          });
        });

        batch.commit();

        offset += limit;

        if (offset >= maxOffset) {
          done = true;
        } else {
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    const bucket = admin.storage().bucket();
    const file = bucket.file('search-index.json', {});
    const writeStream = file.createWriteStream({ private: true });

    writeStream.write(JSON.stringify(searchIndex));
    writeStream.end();

    revokeToken(token);

    response.status(200).send('done');
  } catch(e) {
    response.status(500).send(e.message);
  }
});

// fixme: There may some day be more than 500 platforms and exceed the max batch size
//        allowed by firestore.

exports.fetchPlatforms = functions.https.onRequest(async (request, response) => {
  try {
    const token = await getToken();
    const fields = ['name', 'id', 'abbreviation', ];
    const path = `https://api.igdb.com/v4/platforms?limit=500&fields=${fields.join(',')}`;

    const platforms = await axios({
      url: path,
      method: 'GET',
      headers: {
        'Client-ID': functions.config().igdb.id,
        'Authorization': `Bearer ${token.access_token}`,
        'Accept': 'application/json',
      },
    })
    .then(async function(r) {
      return r.data;
    })
    .catch(function(e) {
      throw(e);
    });

    // Save new platforms

    const batch = db.batch();

    platforms.forEach(platform => {
      const { id, ...data } = platform;
      db.collection('platforms').doc(id.toString()).set(data);
    });

    batch.commit();

    revokeToken(token);

    response.status(200).send(platforms);
  } catch(e) {
    response.status(500).send(e.message);
  }
});