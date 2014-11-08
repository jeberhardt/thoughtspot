var Utils = {

	getDistance: function(lat1, lon1, lat2, lon2) {
		var R = 6371; // km
		var φ1 = lat1.toRadians();
		var φ2 = lat2.toRadians();
		var Δφ = (lat2-lat1).toRadians();
		var Δλ = (lon2-lon1).toRadians();

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		        Math.cos(φ1) * Math.cos(φ2) *
		        Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = R * c;
		return d;
	},
	
	calcDistanceBetween: function(lat1, lon1, lat2, lon2) {
	    var R = 6371; // Radius of earth in KM 
	    var dLat = Utils.toRad(lat2-lat1);
	    var dLon = Utils.toRad(lon2-lon1); 
	    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	            Math.cos(Utils.toRad(lat1)) * Math.cos(Utils.toRad(lat2)) * 
	            Math.sin(dLon/2) * Math.sin(dLon/2); 
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	    var d = R * c;
	    return d;
	},

	toRad: function(Value) {
	    return Value * Math.PI / 180;
	}

}
