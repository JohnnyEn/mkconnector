const isGdShortener = async (url) => {
  return new Promise(async (resolve, reject) => {
    let baseUrl = "https://is.gd/create.php?format=simple&url=";
    let shortUrlResponse = null;

    try {
      shortUrlResponse = await fetch(baseUrl + encodeURIComponent(url));
    } catch(error) {
      console.error(error);
      reject(error);
    }

    resolve(shortUrlResponse.text());
  });
};

export default {
  isGdShortener,
};
