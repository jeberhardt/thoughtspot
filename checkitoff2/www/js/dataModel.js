var dataModel = {
	
	data: [],

	loadThoughtSpotData: function() {
        $.ajax({
            url: "data/tsdata.csv",
            dataType: 'text',
            cache: false
        }).done(function(csvAsString){
            csvArray = csvAsString.csvToArray({ rSep:'\n', quot:"\"" });
            for (var i in csvArray) {
                if (i > 0) {
                    var obj = {};
                    for (var j in csvArray[0]) {
                        obj[csvArray[0][j]] = csvArray[i][j];
                    }
                	dataModel.data.push(obj);
            	}

	        }
            walk.onMapDataLoaded();

       	});
    },

	getInCategory: function(ARG_dataset, ARG_cat) {
		var inCategory = [];
		for (var i in ARG_dataset) {
			// if the category is in the list, add it to the return array
			if (ARG_dataset[i].CATEGORY.indexOf(ARG_cat) != -1)  inCategory.push(ARG_dataset[i])
		}
		return inCategory;
	
	},



	getWithinDistance: function(ARG_dataset, ARG_distance, ARG_startLat, ARG_startLon) {
		var closePlaces = [];
		for (var i in ARG_dataset) {
			var distance = Utils.calcDistanceBetween(ARG_startLat, ARG_startLon, ARG_dataset[i].LATITUDE, ARG_dataset[i].LONGITUDE);
			if (distance < ARG_distance) {
				closePlaces.push (ARG_dataset[i]);
			}
		}
		return closePlaces;
	},

	getOpenNow: function(ARG_id) {
		return {};
	}



}