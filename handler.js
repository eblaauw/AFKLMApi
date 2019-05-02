// Modules
const axios = require('axios');

// Consts
const KLMAirFranceHeaders = {
  'accept-language': 'en-US',
  'afkl-travel-country': 'NL',
  'afkl-travel-host': 'KL',
  'Accept': 'application/hal+json;charset=UTF-8',
  'Content-Type': null,
  'User-Agent': 'AchoombaFlight API Lambda',
  'api-key': '' // @todo: to ENV
};

const amenitiesURL = 'https://api.airfranceklm.com/opendata/inspire/amenities?flight=KL_605_2019-05-01&amp;cabinClass=ECONOMY';
const flightDataURL = 'https://api.airfranceklm.com/opendata/flightstatus/20190501+KL+0605';

async function getFlightData() {
  return axios.all([
    axios.get(amenitiesURL, {headers: KLMAirFranceHeaders}),
    axios.get(flightDataURL, {headers: KLMAirFranceHeaders})
  ])
  .then(axios.spread((flightData, flightAmenities) => {
    console.log('flight data', flightData.data);
    console.log('flight amenity', flightAmenities.data)
    return {...flightData.data, ...flightAmenities.data};
  }))
  .catch((err) => {
    return { error: err.response};
  });
 
}
exports.getFlightInfo = async (event, context, callback) => {
  const flightData = await getFlightData();
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(flightData),
  };
  callback(null, response);
}
