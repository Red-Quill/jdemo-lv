import { wait } from "jutils";
import type { J18Next } from "j18next";



// hax stuff from google maps api documentation. Complains if this is not present
async function initMap(): Promise<void> {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
// <--

let googleApiStatus = 0;

const loadGoogleApi = (googleApiKey:string,callback?:()=>void) => {
	if(googleApiStatus > 0) return;
	googleApiStatus = 1;
	const head = document.head;
	const script = document.createElement("script");
	script.type = "text/javascript";
	//script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&callback=initMap`;
	script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&callback=initMap`;
	script.onload = () => {
		googleApiStatus = 2;
		console.log("Google maps api loaded, doing callbacks");
		callback && callback();
		console.log("Google maps api loaded and callbacks done");
	};
	head.appendChild(script);
};



class GoogleClient {
	_onGoogleApiLoadCallbacks:Set<()=>any>;
	_googlePlacesService:google.maps.places.PlacesService;
	_localization:J18Next;

	constructor(googleApiKey:string) {
		this._onGoogleApiLoadCallbacks = new Set();
		loadGoogleApi(googleApiKey,this._doOnGoogleApiLoadCallbacks);
	}

	init = async (localization:J18Next) => {
		this._localization = localization;
	};

	onGoogleApiLoad = (callback:()=>any) => {
		googleApiStatus < 2 ? this._onGoogleApiLoadCallbacks.add(callback) : callback();
	};

	_doOnGoogleApiLoadCallbacks = () => {
		this._googlePlacesService = new google.maps.places.PlacesService(document.createElement('div'));
		for(const callback of this._onGoogleApiLoadCallbacks) {
			callback();
		}
		this._onGoogleApiLoadCallbacks = new Set();
	};

	getPlaceDetails = (request:google.maps.places.PlaceDetailsRequest) => {
		const _request = { language:this._localization.language,...request };
		return new Promise<google.maps.places.PlaceResult>(async(resolve,reject) => {
			while(!this._googlePlacesService) await wait(200);
			this._googlePlacesService.getDetails(_request,(result)=>{
				result ? resolve(result) : reject(new Error("Something went wrong"));
			});
		});
	}

	get googleMapsApiIsLoaded() {return googleApiStatus >= 2;}
	get googlePlacesService() {return this._googlePlacesService;}
}



export default GoogleClient;
export type { GoogleClient };



/*

<script async
	src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap">
</script>

*/
