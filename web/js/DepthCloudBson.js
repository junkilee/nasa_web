/**
 * @author Julius Kammerl - jkammerl@willowgarage.com
 * edited by Jun Ki Lee - jun_ki_lee@brown.edu
 * some portion of the code from PROWL
 */

/**
 * The DepthCloudBson object.
 *
 * @constructor
 * @param options - object with following keys:
 *   * url - the URL of the stream
 *   * f (optional) - the camera's focal length (defaults to standard Kinect calibration)
 *   * pointSize (optional) - point size (pixels) for rendered point cloud
 *   * width (optional) - width of the video stream
 *   * height (optional) - height of the video stream
 *   * whiteness (optional) - blends rgb values to white (0..100)
 *   * varianceThreshold (optional) - threshold for variance filter, used for compression artifact removal
 */
ROS3D.DepthCloudBson = function(options) {
  options = options || {};
  THREE.Object3D.call(this);
  
  this.pc_subscriber = options.pc_subscriber;
  this.pc_subscriber.subscribe(this.updateParticles.bind(this));

  this.cloud = null;
  this.material = new THREE.ParticleBasicMaterial( { size: 3, sizeAttenuation: false, vertexColors: THREE.FaceColors } );
};

ROS3D.DepthCloudBson.prototype.__proto__ = THREE.Object3D.prototype;

/**
 * Callback called when video metadata is ready
 */
ROS3D.DepthCloudBson.prototype.updateParticles = function(result) {
  var num_renderpoints = result.width*result.height;

  if (num_renderpoints==0)  {
    return;
  }

  // Remove the previous cloud from the scene before displaying the next one.
  if (this.cloud != null) this.remove(this.cloud);

  // Create storage for point cloud display buffers.
  var posA   = new Float32Array(num_renderpoints*3);
  var colorA = new Float32Array(num_renderpoints*3);

  // Set up the data view from which floats and ints will be extracted
  var dv = new DataView(result.data.buffer.buffer);

  // Extract data from typed array
  var step = result.point_step;
  //for (i=0;i<result.width;i++)

  for (var i = 0; i < num_renderpoints; ++i) {   
    var dvi = i*step;	// Data view index
    var x = dv.getFloat32(dvi    ,true);
    var y = dv.getFloat32(dvi+1*4,true);
    var z = dv.getFloat32(dvi+2*4,true);
    var b = dv.getUint8(  dvi+4*4);
    var g = dv.getUint8(  dvi+4*4+1);
    var r = dv.getUint8(  dvi+4*4+2);

    // Populate the display buffers
    var particlePos = i*3;
    posA[particlePos    ] = x;
    posA[particlePos + 1] = y;
    posA[particlePos + 2] = z;
    colorA[particlePos    ] = r/255;
    colorA[particlePos + 1] = g/255;
    colorA[particlePos + 2] = b/255;
  }

  for (var i = 0; i < num_renderpoints*3; i=i+3) { 
    var avgColor = (colorA[i]+colorA[i+1]+colorA[i+2])/3;
    var darkBackground = true;
    var thresh = 0.05;
    if ((darkBackground && avgColor < thresh) ||
       (!darkBackground && avgColor > thresh)) {
      var diff = thresh-avgColor;
      colorA[i] += diff;
      colorA[i+1] += diff;
      colorA[i+2] += diff;
    }
  }

  // Render the points
  var geometry = new THREE.BufferGeometry();
  geometry.attributes[ 'position' ] = {array: posA, itemSize: 3};
  geometry.attributes[ 'color' ] = {array: colorA, itemSize: 3};
  //        geometry.computeBoundingSphere();
  this.cloud = new THREE.ParticleSystem(geometry,this.material);
  this.add(this.cloud);
};
