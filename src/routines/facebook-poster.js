import graph from 'fbgraph';

let graphClient = null;

const createGraphClient = (accessToken) => {
  graphClient = graph.setAccessToken(accessToken);
};

const processMediaItems = async (misskeyNote, facebookAlbumId) => {
  return new Promise(async (resolve, reject) => {
    let mediaIdsArray = [];

    for (let i = 0; i < misskeyNote.files.length; i++) {
      await graphClient.post(`/${facebookAlbumId}/photos?url=${misskeyNote.files[i].url}/${misskeyNote.files[i].name}&published=false`, (error, response) => {
        if (error) {
          console.log(error);
          return;
        }

        mediaIdsArray.push(response.id);

        if (mediaIdsArray.length === misskeyNote.files.length) {
          resolve(mediaIdsArray);
        }
      });
    }
  });
};

const generateMediaItemsQuery = (mediaIdsArray) => {
  return mediaIdsArray.map((id, index) => `attached_media[${index}]={"media_fbid":"${id}"}`).join('&');
};

const post = async (originalMisskeyNote, facebookConfig) => {
  createGraphClient(facebookConfig.accessToken);

  if (originalMisskeyNote.text !== null && originalMisskeyNote.text.includes('#mknofacebook')) {
    return;
  }

  if (originalMisskeyNote.localOnly || typeof originalMisskeyNote.mentions !== 'undefined' || typeof originalMisskeyNote.reply !== 'undefined') {
    return;
  }

  let misskeyNote = originalMisskeyNote;

  if (typeof misskeyNote.renote !== 'undefined') {
    misskeyNote = originalMisskeyNote.renote;
  }

  if (misskeyNote.files.length) {
    processMediaItems(misskeyNote, facebookConfig.albumId)
      .then((mediaIdsArray) => {
        const mediaItemsQuery = generateMediaItemsQuery(mediaIdsArray);

        graphClient.post(`/feed?message=${misskeyNote.text}&${mediaItemsQuery}`, function (error) {
          console.log(error);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return;
  }

  graphClient.post('/feed', { message: misskeyNote.text }, function(error) {
    if (error) {
      console.log(error);
    }
  });
};

export default {
  post,
};
