require('dotenv').config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient= mbxGeocoding({accessToken:'pk.eyJ1IjoiZmFpemFtdSIsImEiOiJjazllMmo2M20wMWMyM21zMzdua2pyYzg5In0._-xqv7iPoQ8a52C9eijdIw'});
async function geocoder(location){
	try{
		let response =await geocodingClient.forwardGeocode({
	query:location,
	limit:1
})
.send()
console.log(response.body.features[0].geometry.coordinates);
}catch(err){
	console.log(err);
}}
geocoder('Alaska,US');
