var scene;
var camera;
var textGeo;
var mTime = 0.0;
var mTimeStep = (1/60);
var mDuration = 20;
// Global mesh object of the cube
var cubeMesh;
var data_coords = [];
var controlers = [];
var data_map = d3.map();
// var axis_width_range = ["Wed Aug 24 2016 00:00:00 GMT-0400 (EDT)","Wed Aug 24 2016 23:59:59 GMT-0400 (EDT)"]
var anotHelper = d3.map()
var coloHelper = d3.map()

var scene, renderer;
			var mouseX = 0, mouseY = 0;

			var formatDay = d3.timeFormat("%a")
			var formatHour = d3.timeFormat("%H")
			var formatMinute = d3.timeFormat("%M")


// ui interactions are updating this which is what the animateScene uses
var ui_current_state = d3.map();
var data_mapped = d3.map()
var device_per_street_map = d3.map()
var device_latlng = d3.map()
//setting defult values for ui
ui_current_state.set("component", "frequency")
ui_current_state.set("delay", 200)
ui_current_state.set("data_needs_to_filter", 0)
ui_current_state.set("data_map_buffr_ind", [1]);
ui_current_state.set("slider_decides",0)



anotHelper.set("frequency", ["Base","Voice", "High"])
anotHelper.set("loudness", ["Lmindba","Leqdba", "Maxdba"])
anotHelper.set("frequency", ["Base","Voice", "High"])

// // loading the data / starting with loading the locations
function loadData(){
	d3.queue()
		.defer(d3.csv,"locationsinter.csv", parseLocations) //locations_nest
    .defer(d3.csv,"res2.csv", parseSamples)
    .await(callbackDataLoaded)
}


var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");



requestStream = new (function(){
	this.line = function(){

	};
	this.totaltime = 49200000;
	this.dt_intervals = 164;
	this.dt = 0;
	this.frame_counter = 0;
	this.frequency = .5;
	this.frame_interval = 0.5
	this.duration = 10

});

circleTemp = new (function(){
	this.radius   = 0.1;
    this.segments = 64;
    this.material = new THREE.LineBasicMaterial( { color: 0xffffff } );
		this.linematerial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: .02, opacity: 0.5} );
    this.geometry = new THREE.CircleGeometry( this.radius, this.segments );


		// Remove center vertex
		this.geometry.vertices.shift();

		this.obj =  new THREE.Line( this.geometry, this.material ) ;

		this.line_geometry = new THREE.Geometry()
		this.line_geometry.vertices.push(
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 0, 0, 3*frameConfig.bandHeight)
			// new THREE.Vector3( 10, 0, 0 )
		);
		this.line = new THREE.Line( this.line_geometry, this.linematerial );

})



dashTemp = new (function(){
	this.geometry = new THREE.Geometry()
	this.geometry.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, 0, 0.2)
	)
	this.material = new THREE.LineBasicMaterial( { color: "#42f453", linewidth: 1} );
	this.obj = new THREE.Line( this.geometry, this.material );
})




var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var samples_mapped = d3.map()

// function
function callbackDataLoaded(err, csv_data, sample_data){
  var lat_min = d3.min(csv_data,function(d){
    return d.lat;
  })
  var lat_max = d3.max(csv_data,function(d){
    return d.lat;
  })
  var lon_min = d3.min(csv_data,function(d){
    return d.lon;
  })
  var lon_max = d3.max(csv_data,function(d){
    return d.lon;
  })
  var max_High = d3.max(sample_data, function(d){
    return d.High
  })
  var min_High = d3.min(sample_data, function(d){
    return d.High
  })

	var max_Base = d3.max(sample_data, function(d){
    return d.Base
  })
  var min_Base = d3.min(sample_data, function(d){
    return d.Base
  })


	var max_Voice = d3.max(sample_data, function(d){
    return d.Voice
  })
  var min_Voice = d3.min(sample_data, function(d){
    return d.Voice
  })



	var max_Leqdba = d3.max(sample_data, function(d){
    return d.Leqdba
  })
  var min_Leqdba = d3.min(sample_data, function(d){
    return d.Leqdba
  })

	var max_Lmaxdba = d3.max(sample_data, function(d){
		return d.Lmaxdba
	})
	var min_Lmaxdba = d3.min(sample_data, function(d){
		return d.Lmaxdba
	})


	var max_Lmindba = d3.max(sample_data, function(d){
		return d.Lmindba
	})
	var min_Lmindba = d3.min(sample_data, function(d){
		return d.Lmindba
	})


  var min_time = d3.min(sample_data,function(d){
    return d.time;
  })
  var max_time = d3.max(sample_data,function(d){
    return d.time;
  })
  ui_current_state.set("rangestart", min_time)
  ui_current_state.set("rangeend", max_time)
	var color_scale_map = d3.map()
  scalerConfig = new (function(){
		this.lat_scale = d3.scaleLinear().range([frameConfig.padding_bottom,frameConfig.height - frameConfig.padding_top]).domain([lat_min, lat_max]);
		this.lng_scale = d3.scaleLinear().range([frameConfig.width-frameConfig.padding_left,frameConfig.padding_right]).domain([lon_min, lon_max]);
    this.High_scale = d3.scalePow().range([2*frameConfig.bandHeight, 3*frameConfig.bandHeight]).domain([min_High, max_High]);
		this.Base_scale =d3.scalePow().range([0, frameConfig.bandHeight]).domain([min_Base, max_Base]);
		this.Voice_scale = d3.scalePow().range([frameConfig.bandHeight, 2*frameConfig.bandHeight]).domain([min_Voice, max_Voice]);
		// this.Leqdba_scale = d3.scaleLog().range([0, 4]).domain([min_Leqdba, max_Leqdba]);
		// this.Lmaxdba_scale = d3.scaleLog().range([0, 4]).domain([min_Lmaxdba, max_Lmaxdba]);
		// this.Lmindba_scale = d3.scaleLog().range([0, 4]).domain([min_Lmindba, max_Lmindba]);

		this.Leqdba_scale = d3.scalePow().range([frameConfig.bandHeight, 2*frameConfig.bandHeight]).domain([min_Leqdba, max_Leqdba]);
		this.Lmaxdba_scale = d3.scalePow().range([2*frameConfig.bandHeight, 3*frameConfig.bandHeight]).domain([min_Lmaxdba, max_Lmaxdba]);
		this.Lmindba_scale = d3.scalePow().range([0, frameConfig.bandHeight]).domain([min_Lmindba, max_Lmindba]);

    this.Components_scale_Loudness = d3.scaleOrdinal()
      .range(["#bd0026", "#ffffb2", "#fd8d3c"])
      .domain(["Base","Voice","High"]);
		this.Components_scale_Frequency = d3.scaleOrdinal()
      .range(["#bd0026", "#ffffb2", "#fd8d3c"])
      .domain(["Lmindba","Leqdba","Lmaxdba"]);
    this.time_range = [min_time,max_time];
		this.color_scale_map = color_scale_map;
	})
	scalerConfig.color_scale_map.set("frequency", scalerConfig.Components_scale_Frequency);
	scalerConfig.color_scale_map.set("loudness", scalerConfig.Components_scale_Loudness)
  var nested_samples = d3.nest()
    .key(function(d){
      return d.DeviceId;
    })
    .entries(sample_data);

  nested_samples.forEach(function(dev_d){
    var devic_id = dev_d.key;
    var device_mapped_id_value = d3.map();


		var sorted_values = dev_d.values.sort(function(a,b){
			return d3.descending(a.time, b.time);
		})
    sorted_values.forEach(function(d){
      var device_mapped_values = d3.map();
      device_mapped_values.set("Base",d.Base);
			device_mapped_values.set("Voice",d.Voice);
      device_mapped_values.set("Leqdba",d.Leqdba);
      device_mapped_values.set("Lmaxdba",d.Lmaxdba);
      device_mapped_values.set("Lmindba",d.Lmindba);
      device_mapped_values.set("High",d.High);
      device_mapped_id_value.set(d.time, device_mapped_values);
    })


  samples_mapped.set(devic_id,device_mapped_id_value)
  })

  var nested_data = d3.nest()
    .key(function(d) { return d.street; })
    .entries(csv_data);

  ui_current_state.set("rangestart", min_time);
  ui_current_state.set("rangeend", max_time);


	nested_data.forEach(function(each_street){
		var street_name = each_street.key;
		var dev_ids = each_street.values.map(function(v){return v.id;})
		each_street.values.forEach(function(each_point){
			each_point.x = scalerConfig.lng_scale(each_point.lon)
			each_point.y = scalerConfig.lat_scale(each_point.lat)
			device_latlng.set(each_point.id, [each_point.x,each_point.y])
			data_coords.push({
				'device_id': each_point.id,
				'x': scalerConfig.lng_scale(each_point.lon),
				'y': scalerConfig.lat_scale(each_point.lat),
				'name': street_name,
				// 'device_values': samples_mapped.get(each_point.id)
			})
		})
		device_per_street_map.set(street_name,dev_ids)
	})

  initializeScene(nested_data);
	// Animate the scene
	animateScene();


	time_line.append("g").attr("id","timetext").append("text")


	var width_scale = d3.scaleTime().range([0,time_line_width]).domain(scalerConfig.time_range)

	var height2 = 50;
		var width = time_line_width;
	var xAxis = d3.axisBottom(width_scale);

				var context = time_line.append("g")
				    .attr("class", "context")
				    .attr("transform", "translate(" + 5 + "," + 5 + ")");
						context.append("g")
						      .attr("class", "axis axis--x")
						      .attr("transform", "translate(0," + 14 + ")")
						      .call(xAxis);

						context.append("g")
						      .attr("class", "brush")
						      // .call(brush)
						      // .call(brush.move, x.range());

function brushed() {
	var s = d3.event.selection || x2.range();


}
	var textTicksContainer = time_line.append("g");

	function dragStart(){
	  d3.event.sourceEvent.stopPropagation();
	  d3.select(this).classed("dragging", true);
	}

}


var text = "db",
	size = frameConfig.text_size,
	hover = 3,
	curveSegments = 4,
	bevelThickness = 0.02,
	bevelSize = 0.5,
	bevelSegments = 3,
	bevelEnabled = true,
	font = font,
	// fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
	fontWeight = "normal"; // normal bold
var mirror = true;

var textmaterial = new THREE.MultiMaterial( [
					new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5 } ),
					new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
				] );








var fontLoader = new THREE.FontLoader();
fontLoader.load( 'NeueHaas.json', function ( font ) {

	textGeo = new THREE.TextGeometry( text, {
		font: font,
		size: size,
		height: 0.1,
		curveSegments: curveSegments,
		// bevelThickness: bevelThickness,
		// bevelSize: bevelSize,
		// bevelEnabled: bevelEnabled,
		material: 0,
		// extrudeMaterial: 1
	});
	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	// var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	textMesh1 = new THREE.Mesh( textGeo, textmaterial );
	// textMesh1.position.x = centerOffset;
	// textMesh1.position.y = hover;
	// textMesh1.position.z = 0;
	// textMesh1.rotation.x = 0;
	// textMesh1.rotation.y = Math.PI * 2;


	annotationTempClass = function(text){
			this.text = anotHelper.get("text") || "db"
			this.size = frameConfig.text_size;
			this.height = 0.01;
			this.hover = 3;
			this.curveSegments = 4;
			this.bevelThickness = 0.02;
			this.bevelSize = 0.5;
			this.bevelSegments = 3;
			this.bevelEnabled = true;
			this.font = font;
			// fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
			this.fontWeight = "normal"; // normal bold
			this.mirror = true;

			this.textmaterial = new THREE.MultiMaterial( [
								new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5 } ),
								new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
							] );

			this.textGeo = new THREE.TextGeometry( this.text, {
				font: this.font,
				size: this.size,
				height: this.height,
				curveSegments: this.curveSegments,
				// bevelThickness: bevelThickness,
				// bevelSize: bevelSize,
				// bevelEnabled: bevelEnabled,
				material: 0,
				// extrudeMaterial: 1
			});
			this.textGeo.computeBoundingBox();
			this.textGeo.computeVertexNormals();

			// var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
			this.obj = new THREE.Mesh( this.textGeo, this.textmaterial );


	}
	annotationTemp = new (annotationTempClass)
	anotHelper.set("text","somett")

	annotationTemp = new (annotationTempClass)


	loadData();

	// scene.add(textMesh1);

} );





controlables = []


function initializeScene(data){

	// making the renderer
	// detecting if the browser supports webGL
	if(Detector.webgl){
		renderer = new THREE.WebGLRenderer({antialias:true});
	} else {
		renderer = new THREE.CanvasRenderer();
	}
	// setting renderer properties
	renderer.setClearColor(0x00000, 1);
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight-100;
	renderer.setSize(canvasWidth, canvasHeight);
	document.getElementById("WebGLCanvas").appendChild(renderer.domElement);
	// setting up the scene and camera
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
	var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
				dirLight.position.set( 0, 0, 1 ).normalize();
				// scene.add( dirLight );
				var pointLight = new THREE.HemisphereLight();
				// pointLight.position.set( 0, 100, 90 );
				scene.add( pointLight );
	camera = new THREE.PerspectiveCamera( frameConfig.fov, frameConfig.aspect, frameConfig.near, frameConfig.far );
	// camera = new THREE.CubeCamera( frameConfig.near, frameConfig.far, 128 );
// camera = new THREE.PerspectiveCamera((frameConfig.width / - 2) - 1 , (frameConfig.width / 2) + 1, frameConfig.height / 3, frameConfig.height / - 3, 1, 1000 )

// camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );
			// scene = new THREE.Scene();
			camera.position.y = 30[ frameConfig.width/2 + frameConfig.width/2 * frameConfig.width ] * ( 40 ) + 5;
			camera.position.z = frameConfig.height / 2;
			camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	var boxGeometry = new THREE.BoxGeometry(frameConfig.width, frameConfig.height, 0.01);


	var mapTexture = new THREE.ImageUtils.loadTexture('ph8.png');
	var boxMaterial = new THREE.MeshBasicMaterial({
		map: mapTexture,
		side:THREE.DoubleSide

	});


	boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	// boxMesh.position.set(frameConfig.width/2,frameConfig.height/2,0.0);
	// controls.attach(boxMesh)
	// controlers.push(controls)

	// scene.add(boxMesh);



			var geometry = new THREE.PlaneBufferGeometry( frameConfig.width, frameConfig.height, 20 - 1, 50 - 1 );
				geometry.rotateX( -Math.PI / 2 );
				var vertices = geometry.attributes.position.array;
				// for ( var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3 ) {
				// 	// j + 1 because it is the y component that we modify
				// 	vertices[ j + 1 ] = heightData[ i ];
				// }
				geometry.computeVertexNormals();
				var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xC7C7C7 } );
				terrainMesh = new THREE.Mesh( geometry, groundMaterial );
				terrainMesh.receiveShadow = false;
				terrainMesh.castShadow = false;
				// scene.add( terrainMesh );
				var textureLoader = new THREE.TextureLoader();
				textureLoader.load("ph26.png", function ( texture ) {
					// texture.wrapS = THREE.RepeatWrapping;
					// texture.wrapT = THREE.RepeatWrapping;
					// texture.repeat.set( terrainWidth - 1, terrainDepth - 1 );
					groundMaterial.map = texture;
					groundMaterial.needsUpdate = true;
				});



				// var background_geometry = new THREE.PlaneBufferGeometry( 2 * frameConfig.width, 2 * frameConfig.height, 20 - 1, 50 - 1 );
				// 	background_geometry.rotateX( -Math.PI / 2 );
				// 	var b_vertices = background_geometry.attributes.position.array;
				// 	// for ( var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3 ) {
				// 	// 	// j + 1 because it is the y component that we modify
				// 	// 	vertices[ j + 1 ] = heightData[ i ];
				// 	// }
				// 	background_geometry.computeVertexNormals();
				//
				// 	var b_groundMaterial = new THREE.MeshPhongMaterial( { color: 0xC7C7C7 } );
				//
				// 	b_terrainMesh = new THREE.Mesh( background_geometry, b_groundMaterial );
				// 	b_terrainMesh.position.y = -1;
				//
				// 	b_terrainMesh.receiveShadow = false;
				// 	b_terrainMesh.castShadow = false;
				//
				// 	var textureLoader = new THREE.TextureLoader();
				// 	textureLoader.load("b_ph10.png", function ( texture ) {
				// 		// texture.wrapS = THREE.RepeatWrapping;
				// 		// texture.wrapT = THREE.RepeatWrapping;
				// 		// texture.repeat.set( terrainWidth - 1, terrainDepth - 1 );
				// 		b_groundMaterial.map = texture;
				// 		b_groundMaterial.needsUpdate = true;
				// 	});



					var Bbackground_geometry = new THREE.PlaneBufferGeometry( 2.1 * frameConfig.width, 2 * frameConfig.height, 20 - 1, 50 - 1 );
						Bbackground_geometry.rotateX( -Math.PI / 2 );
						var Bb_vertices = Bbackground_geometry.attributes.position.array;
						// for ( var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3 ) {
						// 	// j + 1 because it is the y component that we modify
						// 	vertices[ j + 1 ] = heightData[ i ];
						// }
						Bbackground_geometry.computeVertexNormals();

						var Bb_groundMaterial = new THREE.MeshPhongMaterial( { color: 0xC7C7C7 } );

						Bb_terrainMesh = new THREE.Mesh( Bbackground_geometry, Bb_groundMaterial );
						Bb_terrainMesh.position.y = -0.01;

						Bb_terrainMesh.receiveShadow = false;
						Bb_terrainMesh.castShadow = false;

						var textureLoader = new THREE.TextureLoader();
						textureLoader.load("b_ph17.png", function ( texture ) {
							// texture.wrapS = THREE.RepeatWrapping;
							// texture.wrapT = THREE.RepeatWrapping;
							// texture.repeat.set( terrainWidth - 1, terrainDepth - 1 );
							Bb_groundMaterial.map = texture;
							Bb_groundMaterial.needsUpdate = true;
						});




					scene.add( Bb_terrainMesh,terrainMesh );
					// var eh = new THREE.EdgesHelper( Bb_terrainMesh );
					// eh.material.opacity = 0.5;
					// eh.material.transparent = true;

	group = new THREE.Group();
  // surfaveGroup = new THREE.Group()
  lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });
  street_lines_group = new THREE.Group();
	street_lines_group_voice = new THREE.Group();
	street_lines_group_base = new THREE.Group();


	street_lines_object_group = new THREE.Group();
	street_lines_object_group_voice = new THREE.Group();
	street_lines_object_group_base = new THREE.Group();


	axis_lines_group = new THREE.Group();


  street_surf_group = new THREE.Group();
	street_surf_group2 = new THREE.Group();
	street_surf_group3 = new THREE.Group();


	chart_axis_line_group = new THREE.Group();

	dash_value_line_group = new THREE.Group();


	textGroup = new THREE.Group();
	componentTextGroup = new THREE.Group();
	comp1TextGroup = new THREE.Group();
	comp2TextGroup = new THREE.Group();
	comp3TextGroup = new THREE.Group();
// creating the line from iteration through the data


// basics for making the chart axis lines
// each street: two lines same vertices as the surf geometries
// height is min max of the component

for (var s=0; s < device_latlng.keys().length; s++){
	var devi_ce = device_latlng.get(device_latlng.keys()[s])
	// console.log("devi_ce",devi_ce)

}


	data.forEach(function(coord){


		var objectGroup = new THREE.Group();
		var objectGroupVoice = new THREE.Group();
		var objectGroupBase = new THREE.Group();

		var axisStreetGroups = new THREE.Group();
		var chartAxisLinesGroup = new THREE.Group();
		var surfStreetGroups = new THREE.Group();
		var surfStreetGroups2 = new THREE.Group();
		var surfStreetGroups3 = new THREE.Group();

    var curveGeometry = new THREE.Geometry();


		var sorted_streets = coord.values.sort(function(a,b){
			return d3.descending(a.instreet_rank, b.instreet_rank);
		})

		var svector_array = [];

		var axis_svector_array = [];
		var surf_svector_array = [];
		var chartaxislines_svector_array = [];

		// svector_array.push(_this_point_buffer)
		for (iii = 0; iii < sorted_streets.length; iii++){


			var objectColorGroup = new THREE.Group();
			var objectColorGroupVoice = new THREE.Group();
			var objectColorGroupBase = new THREE.Group();

			var axisColorGroup = new THREE.Group();




			var axisGeometry = new THREE.Geometry();
			// var textG = new THREE.TextGeometry("test text")

			var _this_point_axis_base = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,-frameConfig.lead);
			var _this_point_axis_head = _this_point_axis_base.clone();
			// axis_svector_array.push
			axisGeometry.vertices.push(_this_point_axis_base,_this_point_axis_head)

			// if


			var axisMaterial = new THREE.LineBasicMaterial({
				color: "#fffff", // scalerConfig.Components_scale_Frequency.get("High"),// colorScale(current_component),
				linewidth:4,
			});

			var axis_line = new THREE.Line(axisGeometry, lineMaterial)
			// axisStreetGroups.add(axis_line)

			var _this_point = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);

			var _this_point_buffer = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);

			if (iii == 0){
				var _this_point_buffer_surf = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,-frameConfig.lead);
				var _this_point_surf = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,0);
				surf_svector_array.push(_this_point_buffer_surf,_this_point_surf);
				chartaxislines_svector_array.push(_this_point_buffer_surf,_this_point_surf);



			} else if (iii == sorted_streets.length-1) {



				var _last_point_buffer_surf = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
				surf_svector_array.push(_last_point_buffer_surf)
				chartaxislines_svector_array.push(_last_point_buffer_surf)
				for (var j=sorted_streets.length-1; j > 0;j--){
					var _add_point_buffer_surf = new THREE.Vector3(sorted_streets[j].x,sorted_streets[j].y,-frameConfig.lead);
					surf_svector_array.push(_add_point_buffer_surf)
					chartaxislines_svector_array.push(_add_point_buffer_surf)

				}
			} else {
				_this_point_surf = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
				surf_svector_array.push(_this_point)
				chartaxislines_svector_array.push(_this_point)
			}

			svector_array.push(_this_point)
			// chartaxislines_svector_array.push(_this_point_buffer_surf)

			var current_component = ui_current_state.get("component");
			var colorScale = scalerConfig.color_scale_map.get(current_component);
				var lineMaterial = new THREE.LineBasicMaterial({
		      color: "#bd0026", // scalerConfig.Components_scale_Frequency.get("High"),// colorScale(current_component),
		      linewidth:1,
		    });

				var objectMaterial = new THREE.MeshBasicMaterial({
           vertexColors:THREE.VertexColors,
           side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					combine: THREE.Multiply ,
					//  vertexColors: THREE.FaceColors,
					 color: "#bd0026",
					 transparent: true,
					 opacity: 0.5,
					 linewidth:8,
					 depthWrite: true, depthTest: false,wireframe: false,wireframeLinewidth:3
					//  alphaTest: 0.5
				});

				var objectMaterial2 = new THREE.MeshBasicMaterial({
           vertexColors:THREE.VertexColors,
           side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					 combine: THREE.NoBlending,
					//  vertexColors: THREE.FaceColors,
					 color: "#fd8d3c",
					 transparent: true,
					 linewidth:5,
					 opacity: 0.5,
					 depthWrite: true, depthTest: false
					//  alphaTest: 0.5
				});

				var objectMaterial3 = new THREE.MeshBasicMaterial({
           vertexColors:THREE.VertexColors,
           side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					combine: THREE.NoBlending,
					//  vertexColors: THREE.FaceColors,
					 color: "#ffffb2",
					 transparent: true,
					 linewidth:5,
					 opacity: 0.5,
					 depthWrite: true, depthTest: false
					//  alphaTest: 0.5
				});


				var ChartAxisobjectMaterial =  new THREE.LineBasicMaterial( {
					color: 0xffffff,
					opacity: 0.01,
					linewidth: 0.01
					} ) ;


				axis_line.name = sorted_streets[iii].id;

				axisStreetGroups.add(axis_line)
				// axis_lines_group.add(axisStreetGroups)
				axisColorGroup.name = sorted_streets[iii].street
				// console.log(object)
				// scene.add(object)

		}
		var surfGeometry = new THREE.Geometry();
		var chartAxsisGeometry = new THREE.Geometry();

		var splineSurf = new THREE.SplineCurve3(surf_svector_array);
		var splineChartAxis = new THREE.SplineCurve3(chartaxislines_svector_array);
		var splinePointsSurf = splineSurf.getPoints(2*sorted_streets.length-1);
		var splineChartAxisPointsSurf = splineChartAxis.getPoints(2*sorted_streets.length-1);


		for(var i = 0; i < splinePointsSurf.length; i++){
				surfGeometry.vertices.push(splinePointsSurf[i]);
		}


			for(var i = 0; i < splineChartAxisPointsSurf.length; i++){
					chartAxsisGeometry.vertices.push(splineChartAxisPointsSurf[i]);
			}
			chartAxsisGeometry.vertices.push(splineChartAxisPointsSurf[0]);




		for (var inn=0; inn < sorted_streets.length; inn++){

			if (inn==0){
				surfGeometry.faces.push( new THREE.Face3( inn, inn+1, 2*sorted_streets.length-1));

			} else if (inn==sorted_streets.length-1){
				surfGeometry.faces.push( new THREE.Face3( inn, inn+1, inn+2));
			} else {
				surfGeometry.faces.push( new THREE.Face3( inn, inn+1, 2*sorted_streets.length-inn));
				surfGeometry.faces.push( new THREE.Face3( inn+1, 2*sorted_streets.length-inn-1, 2*sorted_streets.length-inn));

				// surfGeometry.faces.push( new THREE.Face3( inn, inn+2, (2*sorted_streets.length-1)-(inn+1)));
			}

		}
		var surfGeometry2 = surfGeometry.clone()
		var surfGeometry3 = surfGeometry.clone()

		var surfObject = new THREE.Mesh( surfGeometry, objectMaterial );

		var surfObject2 = new THREE.Mesh( surfGeometry2, objectMaterial2 );

		var surfObject3 = new THREE.Mesh( surfGeometry3, objectMaterial3 );


		var chartAxsisObject = new THREE.Line( chartAxsisGeometry, ChartAxisobjectMaterial );

		surfObject.position.set(-frameConfig.width/2,0.0,frameConfig.height/2);
		surfObject2.position.set(-frameConfig.width/2,0.0,frameConfig.height/2);
		surfObject3.position.set(-frameConfig.width/2,0.0,frameConfig.height/2);

// MAX Or MIN HERE
		var chartAxsisObject2 = chartAxsisObject.clone();
		var chartAxsisObject3 = chartAxsisObject.clone();
		chartAxsisObject.position.set(-frameConfig.width/2,1*frameConfig.bandHeight,frameConfig.height/2);
		chartAxsisObject2.position.set(-frameConfig.width/2,2*frameConfig.bandHeight,frameConfig.height/2);
		chartAxsisObject3.position.set(-frameConfig.width/2,3*frameConfig.bandHeight,frameConfig.height/2);

surfObject.rotateX( -Math.PI / 2 );
surfObject2.rotateX( -Math.PI / 2 );
surfObject3.rotateX( -Math.PI / 2 );

chartAxsisObject.rotateX( -Math.PI / 2 );
chartAxsisObject2.rotateX( -Math.PI / 2 );
chartAxsisObject3.rotateX( -Math.PI / 2 );

		surfObject.num_of_street_devices = sorted_streets.length;
		var userData={}
		for (dev_ind=0;dev_ind <sorted_streets.length;dev_ind++){
			userData[dev_ind] = sorted_streets[dev_ind].id
		}

		surfObject.name = sorted_streets[0].street;
		surfObject.userData = userData;

		axisColorGroup.add(axisStreetGroups)

		// axisGroups.add(axisStreetGroupsGroup);
		axis_lines_group.add(axisColorGroup)
		street_surf_group.add(surfObject)
		street_surf_group2.add(surfObject2)
		street_surf_group3.add(surfObject3)

		chart_axis_line_group.add(chartAxsisObject,chartAxsisObject2)


  })
// console.log("chart_axis_line_group",chart_axis_line_group)

  camera.position.set(frameConfig.camera_x, frameConfig.camera_y, frameConfig.camera_z);
  // camera.lookAt(new THREE.Vector3(0*5.5*frameConfig.width/10, frameConfig.height/2, 0));
  // camera.rotation.y = frameConfig.camera_rotate_y
	// camera.rotation.z = frameConfig.camera_rotate_z
	// camera.rotation.x = frameConfig.camera_rotate_x
  scene.add(camera);

  // scene.add(street_lines_group);
	// scene.add(street_lines_group_voice);
	// scene.add(street_lines_group_base);
	// scene.add(street_lines_object_group_voice);
	// scene.add(street_lines_object_group_base);
	// scene.add(street_lines_object_group);

allObjGroup = new THREE.Group()
controlables = []
controlables.push(boxMesh,street_surf_group,street_surf_group2,street_surf_group3)

var axisHelper = new THREE.AxisHelper( 500 );
parrent = scene
controls = new THREE.OrbitControls(camera);
// controls.maxPolarAngle = Math.PI/2;
controls.minDistance = 1;
controls.maxDistance = 33;
controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI/2.3; // radians
// controls.target.y = 2;
// var controls = new THREE.TransformControls(camera,renderer.domElement)
// cameraHelper = new THREE.CameraHelper(camera);
// cameraHelper.pointMap()
// controls.enableZoom = true;
controls.target.set( 0.0, 1.0, 0.0 );
controls.userPanSpeed = 100;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
controls.keys = [ 65, 83, 68 ];
controls.addEventListener( 'change', renderScene );
window.addEventListener( 'resize', onWindowResize, false );
controlers.push(controls)
for (var i=0; i < 4; i++){
	// controls = new THREE.TrackballControls( camera );
				// controls.rotateSpeed = 4;
	// var controls = new THREE.TransformControls(camera,renderer.domElement)
	// cameraHelper = new THREE.CameraHelper(camera);
	// cameraHelper.pointMap()
	// controls.enableZoom = false;
	// controls.addEventListener( 'change', renderScene );

	// controls.attach(controlables[i])
	// controls.setMode("rotate")
	// controls.setMode("scale")
	controlers.push(controls)
	parrent.add(controls);
	// parrent = controlables[i]
}
allObjGroup.add(street_surf_group,street_surf_group2,street_surf_group3)
scene.add(chart_axis_line_group)
scene.add(allObjGroup)
// scene.add(axisHelper)

scene.add(textGroup, componentTextGroup)

for (var vr = 0; vr < street_surf_group.children.length;vr++){
var dev_index = 0
var dash_instreet_group = new THREE.Group()


// var text = ui_current_state.get("component")
// anotHelper.set("text",text)
// annotationTemp = new (annotationTempClass)
// var ann = annotationTemp.obj.clone();
// ann.text = "osomethig"
//
// // ann.rotateZ( -Math.PI / 2 );
// ann.rotateY( -Math.PI / 4  );
// ann.position.set((0.2 + street_surf_group.children[vr].geometry.vertices[1].x - frameConfig.width/2) , 0.1,- (street_surf_group.children[vr].geometry.vertices[1].y - frameConfig.height/2));
// textGroup.add(ann)


	street_surf_group.children[vr].geometry.vertices.forEach(function(vert){

		var dev_id = street_surf_group.children[vr].userData[dev_index]
		// circles for the sensors locations
		if (vert.z >= 0){
			var eps = 0.01;//epsilon to extrude up from the surface
			var cir = circleTemp.obj.clone();
			cir.rotateX( -Math.PI / 2 );

			cir.position.set(-frameConfig.width/2,3*frameConfig.bandHeight,frameConfig.height/2);

			cir.position.set((vert.x - frameConfig.width/2) , vert.z + eps ,- (vert.y - frameConfig.height/2));


			//  axis bounding lines
			var line = circleTemp.line.clone()
			line.rotateX( -Math.PI / 2 );
			line.position.set((vert.x - frameConfig.width/2) , vert.z + eps ,- (vert.y - frameConfig.height/2));
			scene.add(cir, line);




			// annotations


			for (var ii=0; ii<3; ii++){
				var text = anotHelper.get(ui_current_state.get("component"))[ii]
				// console.log(text)

				anotHelper.set("text",text)
				annotationTemp = new (annotationTempClass)
				var ann = annotationTemp.obj.clone();
				ann.text = "osomethig"

				// console.log(ann)
				// ann.rotateZ( -Math.PI / 2 );
				ann.rotateY( -Math.PI / 2  );
				ann.position.set((0.1 + vert.x - frameConfig.width/2) , frameConfig.bandHeight/2 + (ii * frameConfig.bandHeight),- (vert.y - frameConfig.height/2));
				// console.log(ann)
				componentTextGroup.add(ann)
			}



			// value dashes
			// console.log("dev_id",dev_id)
			var dash_indevice_group = new THREE.Group()
			for (var ii=0; ii<4; ii++){
				var dash = dashTemp.obj.clone();
				dash.userData = {'device_id': dev_id}
				dash.rotateY( -ii * Math.PI / 2 );
				dash.position.set((vert.x - frameConfig.width/2) , vert.z,- (vert.y - frameConfig.height/2));
				dash_indevice_group.add(dash)
		}
		dash_instreet_group.add(dash_indevice_group)


		} else {
			//lines for the sensors locations



		}
		// scene.add(cir, line);


		// if (vert.z <)

	})
dash_value_line_group.add(dash_instreet_group)
}
// scene.add(street_surf_group);

// var t = textMesh1.clone();
// t.position.x = -sorted_streets[iii].y;
// t.position.z = sorted_streets[iii].x;
// t.position.y = -1
// t.position.set(chart_axis_line_group.children[1].geometry.vertices[0].y - frameConfig.height/2 , 2,  chart_axis_line_group.children[1].geometry.vertices[0].x - frameConfig.width/2);

// t.rotateX( -Math.PI / 2 );
// textGroup.add(t)
// console.log(dash_value_line_group)


// scene.add(circleTemp.obj)

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  renderScene();

}
function animateScene(){
	for (var ini=0; ini < componentTextGroup.children.length; ini++){
		rotateBillboard(componentTextGroup.children[ini]);
	}

// console.log(axis_lines_group)
// console.log(lkjnsdlk)

// console.log(ui_current_state)
	if (requestStream.frame_counter > frameConfig.numPoints-1){
			requestStream.frame_counter = 1;
			var t = requestStream.frame_counter;
	} else {
		var t = requestStream.frame_counter;
	}

	// console.log("t",t,street_lines_group)
  if (ui_current_state.get("data_needs_to_filter") > 0){
    data  = filterData()
  }

// console.log(street_surf_group)
// console.log(kjwekj)
	for (var sn = 0; sn < street_surf_group.children.length; sn++){
		for (var vert = 0; vert < street_surf_group.children[sn].geometry.vertices.length; vert++){



			count = t;
			var vir_v = vert - count - 1;

			if (vir_v < 0){
				var bufferIndex = vir_v + frameConfig.numPoints;
			}
			else if (vir_v < street_surf_group.children[sn].num_of_street_devices - 1){
				var bufferIndex = vir_v;
			}	else {
				var bufferIndex = vir_v;
			}





			ui_current_state.set("buffr_ind", bufferIndex);
			if (vert == 0){

				// var va = datamap.get(datamap.keys()[bufferIndex]);
				// ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);



				// console.log(lsdj)

				var deviceid = street_surf_group.children[sn].userData[vert]

				datamap = samples_mapped.get(deviceid)

				var va = datamap.get(datamap.keys()[bufferIndex]);
				ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);

				if (ui_current_state.get("slider_decides") == 0) {
					updateDynamicText()
					ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);
				}


				function getZVal(va){
					var Leqdba = va.get("Leqdba")
					var Lmaxdba = va.get("Lmaxdba")
					var Lmindba = va.get("Lmindba")

					var Voice = va.get("Voice")
					var High = va.get("High")
					var Base = va.get("Base")
					if (ui_current_state.get("component") == "frequency"){
						var vals = []
						vals.push(scalerConfig.Leqdba_scale(Leqdba),scalerConfig.Lmaxdba_scale(Lmaxdba),scalerConfig.Lmindba_scale(Lmindba))
						return vals
					} else {
						var vals = []
						vals.push(scalerConfig.Voice_scale(Voice),scalerConfig.High_scale(High),scalerConfig.Base_scale(Base))
						return vals
					}

				}

				var zVals = getZVal(va)

				axis_lines_group.children[sn].children[vert].children[0].geometry.vertices[1].z = zVals[1]
				street_surf_group.children[sn].geometry.vertices[1].z = zVals[0]
				street_surf_group2.children[sn].geometry.vertices[1].z = zVals[1]
				street_surf_group3.children[sn].geometry.vertices[1].z = zVals[2]
				street_surf_group.children[sn].geometry.vertices[0].z = 1 * frameConfig.bandHeight;
				street_surf_group2.children[sn].geometry.vertices[0].z = 2 * frameConfig.bandHeight;
				street_surf_group3.children[sn].geometry.vertices[0].z = 0;



			} else if (vert == street_surf_group.children[sn].geometry.vertices.length / 2){
				var deviceid = street_surf_group.children[sn].userData[street_surf_group.children[sn].num_of_street_devices-1]

				datamap = samples_mapped.get(deviceid)

				var va = datamap.get(datamap.keys()[bufferIndex]);
				if (ui_current_state.get("slider_decides") == 0) {
					updateDynamicText()
					ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);
				}

				var Leqdba = va.get("Leqdba")
											var Lmaxdba = va.get("Lmaxdba")
											var Lmindba = va.get("Lmindba")



				function getZVal(va){
												var Leqdba = va.get("Leqdba")
												var Lmaxdba = va.get("Lmaxdba")
												var Lmindba = va.get("Lmindba")

												var Voice = va.get("Voice")
												var High = va.get("High")
												var Base = va.get("Base")
												if (ui_current_state.get("component") == "frequency"){
													var vals = []
													vals.push(scalerConfig.Leqdba_scale(Leqdba),scalerConfig.Lmaxdba_scale(Lmaxdba),scalerConfig.Lmindba_scale(Lmindba))

													return vals
												} else {
													var vals = []
													vals.push(scalerConfig.Voice_scale(Voice),scalerConfig.High_scale(High),scalerConfig.Base_scale(Base))
													return vals
												}

											}

			var zVals = getZVal(va)

					street_surf_group.children[sn].geometry.vertices[vert].z = zVals[0];
					street_surf_group2.children[sn].geometry.vertices[vert].z = zVals[1]
					street_surf_group3.children[sn].geometry.vertices[vert].z = zVals[2]


			} else if (vert > (street_surf_group.children[sn].geometry.vertices.length / 2)-1){
				street_surf_group.children[sn].geometry.vertices[vert].z = 1 * frameConfig.bandHeight;
				street_surf_group2.children[sn].geometry.vertices[vert].z = 2 * frameConfig.bandHeight;
				street_surf_group3.children[sn].geometry.vertices[vert].z = 0;

					// street_surf_group.children[sn].geometry.vertices[vert].z = 0;

			} else {
				var deviceid = street_surf_group.children[sn].userData[vert]
				datamap = samples_mapped.get(deviceid)

				var va = datamap.get(datamap.keys()[bufferIndex]);

				if (ui_current_state.get("slider_decides") == 0) {
					updateDynamicText()
					ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);
				}



				var Leqdba = va.get("Leqdba")
											var Lmaxdba = va.get("Lmaxdba")
											var Lmindba = va.get("Lmindba")




				function getZVal(va){
					var Leqdba = va.get("Leqdba")
					var Lmaxdba = va.get("Lmaxdba")
					var Lmindba = va.get("Lmindba")

					var Voice = va.get("Voice")
					var High = va.get("High")
					var Base = va.get("Base")
					if (ui_current_state.get("component") == "frequency"){
						var vals = []
						vals.push(scalerConfig.Leqdba_scale(Leqdba),scalerConfig.Lmaxdba_scale(Lmaxdba),scalerConfig.Lmindba_scale(Lmindba))
						return vals
					} else {
						var vals = []
						vals.push(scalerConfig.Voice_scale(Voice),scalerConfig.High_scale(High),scalerConfig.Base_scale(Base))
						return vals
					}

				}


				var colorVals = getColors()

				street_surf_group.children[sn].material.color = colorVals[0]
				street_surf_group2.children[sn].material.color = colorVals[1]
				street_surf_group3.children[sn].material.color = colorVals[2]




				var zVals = getZVal(va)

				street_surf_group.children[sn].geometry.vertices[vert].z = zVals[0]
				street_surf_group2.children[sn].geometry.vertices[vert].z = zVals[1]
				street_surf_group3.children[sn].geometry.vertices[vert].z = zVals[2]

				// console.log(dash_value_line_group.children[sn].children[vert])


				dash_value_line_group.children[sn].children[vert].children.forEach(function(vd){
					// console.log(vd)
					dev_d = vd.userData["device_id"]
					var datamapd = samples_mapped.get(dev_d)

					var vad = datamapd.get(datamapd.keys()[bufferIndex]);
					function getZVal(va){
						var Leqdba = va.get("Leqdba")
						var Lmaxdba = va.get("Lmaxdba")
						var Lmindba = va.get("Lmindba")

						var Voice = va.get("Voice")
						var High = va.get("High")
						var Base = va.get("Base")
						if (ui_current_state.get("component") == "frequency"){
							var vals = []
							vals.push(scalerConfig.Leqdba_scale(Leqdba),scalerConfig.Lmaxdba_scale(Lmaxdba),scalerConfig.Lmindba_scale(Lmindba))
							return vals
						} else {
							var vals = []
							vals.push(scalerConfig.Voice_scale(Voice),scalerConfig.High_scale(High),scalerConfig.Base_scale(Base))
							return vals
						}

					}

					var zValsd = getZVal(vad)
					// ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);
					vd.geometry.vertices[0].y = zValsd[1]
					vd.geometry.vertices[1].y =  zValsd[1]
					vd.geometry.verticesNeedUpdate = true;
				})

				axis_lines_group.children[sn].children[0].children[vert].geometry.vertices[1].z = zVals[1];


axis_lines_group.children[sn].children[0].children[vert].geometry.verticesNeedUpdate = true;





			}
street_surf_group.children[sn].geometry.verticesNeedUpdate = true;
street_surf_group2.children[sn].geometry.verticesNeedUpdate = true;
street_surf_group3.children[sn].geometry.verticesNeedUpdate = true;

		}

	}



	update();


 	renderScene();

 mTime += mTimeStep;
 mTime %= mDuration;
requestStream.frame_counter += 1;

	setTimeout(function(){

			requestAnimationFrame(animateScene);

	}, ui_current_state.get("delay"));

}

function update(){
	for (var i = 0; i < controlers.length; i++){

		controlers[i].update()
	}

}

function renderScene(){

	renderer.render(scene, camera);
}


function makeColorToUpdate(){
  var color = new THREE.Color(
    scalerConfig.Components_scale_Loudness(
      ui_current_state.get("component")
    )
  );
  return color
}

var day = d3.utcDay(new Date);


function updateDataForViz(data){
}
function updateViz(){
  // console.log("ipdate")
  // console.log(makeColorToUpdate())
}


function updateDynamicText(){


	var dtext=$("#dynemictext").html("")
	var dtext=$("#dynemictext").html(formatDay(d3.isoParse(ui_current_state.get("data_map_buffr_ind")))+" "+formatHour(d3.isoParse(ui_current_state.get("data_map_buffr_ind")))+ ":"+formatMinute(d3.isoParse(ui_current_state.get("data_map_buffr_ind"))) )


var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var buffertime = d3.isoParse (ui_current_state.get("data_map_buffr_ind")[0])


	var width_scale = d3.scaleTime().range([0,time_line_width]).domain(scalerConfig.time_range)
	var reverse_width_scale = d3.scaleTime().domain([0,time_line_width]).range(scalerConfig.time_range)

	handle = container.selectAll(".handle")

	handle_enter = handle.data([width_scale(buffertime)]).enter().append("g").attr("class", "handle").attr(
		"width", 1
	).attr(
		"height", 6
	).append("rect").attr("width", 10).attr('height', 30).call(d3.drag().on("drag",dragmove).on("end", dragend)).on("mouseover",function(d){

		ui_current_state.set("delay", 3000)
	})
	//.on("click",function(d){
	//
	// 	ui_current_state.set("delay", 300)
	// 	requestStream.frame_counter += 1;
	//
	//
	// 				requestAnimationFrame(animateScene);
	// })
	var drag = d3.drag()
        .on("drag", function(d,i) {
            d.x += d3.event.dx
            d.y += d3.event.dy
            d3.select(this).attr("transform", function(d,i){
                return "translate(" + [ d.x,d.y ] + ")"
            })
        });
	handle.exit().remove()
	handle.attr('height', 16).attr('transform', function(d){
		return  'translate(' + d + ',' + 10 + ')'
	})


			// var drag = d3.behavior.drag()
			//     .on("drag", dragmove);
			function dragend(d) {
				 if (d3.event.defaultPrevented) return;
				var x = d3.event.x;
			  var y = d3.event.y;
				ui_current_state.set("data_map_buffr_ind",[reverse_width_scale(d3.event.x)])
				requestAnimationFrame(animateScene);

			}
			function dragmove(d) {
				// console.log("ffff")
				if (d3.event.defaultPrevented) return;
				ui_current_state.set("slider_decides",1)
			  var x = d3.event.x;
			  var y = d3.event.y;
				ui_current_state.set("data_map_buffr_ind",[reverse_width_scale(d3.event.x)])
				// console.log(ui_current_state.get("data_map_buffr_ind")[0])
				// console.log(reverse_width_scale(d3.event.x))
			  d3.select(this).attr("transform", "translate(" + x + "," + 0 + ")");
				requestAnimationFrame(animateScene);


			}


	function dragStart(){
		d3.event.sourceEvent.stopPropagation();
		d3.select(this).classed("dragging", true);

	}

}
