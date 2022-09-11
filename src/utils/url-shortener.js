const isGdShortener = async (url) => {
  return new Promise(async (resolve) => {
    let baseUrl = "https://is.gd/create.php?format=simple&url=";
    const shortUrlResponse = await fetch(baseUrl + encodeURIComponent(url));

    resolve(shortUrlResponse.text());
  });
};

export default {
  isGdShortener,
};
