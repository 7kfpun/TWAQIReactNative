import firebase from 'react-native-firebase';

const getAd = (client) => {
  console.log('Get ad from firebase config', client);
  return firebase
    .config()
    .fetch(60) // cache for 60 seconds
    .then(() => firebase.config().activateFetched())
    .then(() => firebase.config().getKeysByPrefix(`ad_custom_${client}_`))
    .then((arr) => firebase.config().getValues(arr))
    .then((objects) => {
      const data = {};
      // Retrieve values
      Object.keys(objects).forEach((key) => {
        data[key] = objects[key].val();
      });

      console.log('firebase config values', data);
      return {
        impressionRate: data[`ad_custom_${client}_impression_rate`],
        imageUrl: data[`ad_custom_${client}_image_url`],
        destinationUrl: data[`ad_custom_${client}_destination_url`],
        isInApp: data[`ad_custom_${client}_is_in_app`],
      };
    })
    .catch(console.warn);
};

exports.getAd = getAd;
