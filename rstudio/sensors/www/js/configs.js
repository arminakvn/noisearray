frameConfig = new (function() {
  this.height = 50;
  this.width = 100;
  this.bbox_reference_topleft_y = 34.085700;
  this.bbox_reference_bottom_left_x = -119.291728;
  this.bbox_reference_bottom_left_y = 34.091616;
  this.bbox_reference_top_right_x = -117.284403;
  this.far = 80 // Camera frustum far plane
  this.fov = 60 // Camera frustum vertical field of view.
  this.near = 1 // Camera frustum near plane.
  this.aspect = this.width / this.height // Camera frustum aspect ratio
  this.camera_z = 19
  this.camera_x = -5
  this.camera_y = 15
  this.camera_rotate_y = 30 * Math.PI / 180
  this.camera_rotate_z = 10 * Math.PI / 180
  this.camera_rotate_x = 60* Math.PI / 180
  this.padding_right = 46.2
  this.padding_left = 35.5
  this.padding_top = 9.7
  this.padding_bottom = 6.5
  this.numPoints = 154//154;
  this.bandHeight = 1;
  this.text_size = .15;
  this.lead = 0.0001
});

componentsConfig = new (function(){
  this.components_map = d3.map()

})

componentsConfig.components_map.set("loudness", ["Lmaxdba","Leqdba","Lmindba"])
componentsConfig.components_map.set("frequency", ["Base","Voice","High"])
