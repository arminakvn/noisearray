function getPointInBetweenByLen(pointA, pointB, length) {

    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);

}

function getPointInBetweenByPerc(pointA, pointB, percentage) {

    var dir = pointB.clone().sub(pointA);
    var len = dir.length();
    dir = dir.normalize().multiplyScalar(len*percentage);
    return pointA.clone().add(dir);

}




function getColors(){
  var colorLmaxdba = new THREE.Color(
    "#0868ac"
  );

  var colorLeqdba= new THREE.Color(
    "#7bccc4"
  );

  var colorLmindba= new THREE.Color(
    "#f0f9e8"
  );







  var colorHigh  = new THREE.Color(
    "#ffffb2"
  );

  var  colorVoice = new THREE.Color(
    "#fd8d3c"
  );

  var colorBase = new THREE.Color(
    "#bd0026"
  );


                if (ui_current_state.get("component") == "frequency"){
                  var colorVals = []
                  colorVals.push(colorLeqdba,colorLmaxdba,colorLmindba)

                  return colorVals
                } else {
                  var colorVals = []
                  colorVals.push(colorVoice,colorHigh,colorBase)
                  return colorVals
                }

              }




      function rotateBillboard (mesh)
      {
          var b = mesh.position.clone();  // billboard location
          var rotaxis = new THREE.Vector3();
          var v, yhat, n;

          v = camera.position.clone(); // clone the camera position
          yhat = new THREE.Vector3(0, 1, 0); // up
          n = new THREE.Vector3(0, 0, 1); // billboard normal

          v.subVectors(v, b); // v-b
          v.sub(yhat.clone().multiplyScalar(v.dot(yhat)));
          v.normalize(); // pxz

          rotangle = Math.acos(v.dot(n));
          rotaxis.crossVectors(n, v);
          if (rotaxis.dot(yhat) < 0) rotangle *= -1;

          mesh.rotation.y = rotangle;
      }
