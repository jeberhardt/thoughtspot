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
            app.onDataLoaded();
        });
    },

	getInCategory: function(ARG_cat) {
		return [];
	},

	getOpenNow: function(ARG_id) {
		return {};
	}



}