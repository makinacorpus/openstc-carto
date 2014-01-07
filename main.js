var OSMMQUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
var OSMMQ = L.tileLayer(OSMMQUrl, {minZoom: 1, maxZoom: 18, 
            subdomains: ["otile1", "otile2", "otile3", "otile4"]})

var map = L.map('map', { zoomControl:false, attributionControl:false});
map.setView([47.09, -1.28], 14);

OSMMQ.addTo(map);

var expected_keys = { "id": true, "libelle": true, "nom": true, "description": true, "service": true, "demandeur": true, "date": true, "statut": true };
var displayed_sites = [];

function loadData() {
	$.getJSON("data/points.geojson", function (data) {
		// Populate the table
		var table_body = "<table class='table table-bordered table-hover'><thead><tr><th style='min-width: 33px;''>N°</th><th>Libellé</th><th>Site / Matériel</th><th>Détails</th><th>Service</th><th>Demandeur</th><th>Date de création</th><th>Statut</th></tr></thead>";
		var markers = L.layerGroup();
    	$.each(data.features, function() {
			var table_row = "";
			var id = this.properties.id;
			$.each(this.properties, function(k , v) {
				if (( k in expected_keys ) && expected_keys[k] ) {
					table_row += "<td>" + v + "</td>";
				}
			})
			if (displayed_sites.indexOf(this.properties.site) == -1) {
				// This is a new site
				displayed_sites.push(this.properties.site);
				var jsondata = {};
			    $.getJSON("data/site" + this.properties.site + ".geojson", function(data) {
			       	var marker = new L.marker(new L.LatLng(data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]), { title: data.features[0].properties.nom });
					marker.bindPopup(data.features[0].properties.nom);
					marker.on('mouseover', marker.openPopup.bind(marker));
					marker._leaflet_id = '10000' + data.features[0].properties.id;
					markers.addLayer(marker);
				} );
			} else {
				// There is already at least one intervention for this site
			}
			table_body += "<tr class=" + 10000 + this.properties.site + " onmouseover='map._layers[ " + 10000 + this.properties.site +"].openPopup();''>"+table_row+"</tr>";   

		})
		$("#table").html(table_body+"</table>");
		map.addLayer(markers);
		map.on('popupopen', function (e) {
		  $("tr." + e.popup._source._leaflet_id).css("background", "#f5f5f5");
		});
		map.on('popupclose', function (e) {
		  $("tr." + e.popup._source._leaflet_id).css("background", "#fff");
		});

	});
}

loadData();