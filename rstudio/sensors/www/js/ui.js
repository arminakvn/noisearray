// d3.select("#uicontrols").on("mouseover",function(event){
//   console.log("on ui controls")
//   d3.event.sourceEvent.stopPropagation();
// })
var counter = 0;
$('#components').dropdown({
  // allowAdditions: false,
  onChange: function(val){
    console.log("value of selection in drop down", val)
    if (ui_current_state.get("component")!= "val"){
      ui_current_state.set("component", val)

for (var ini=0; ini < componentTextGroup.children.length; ini++){

      // for (var ii=0; ii<3; ii++){
        // var iniii = (ini * 3) + ii;
        // console.log(iniii)
        var clbl = componentTextGroup.children[ini];
        console.log(clbl)


        var text = anotHelper.get(ui_current_state.get("component"))[counter]
        console.log(text)
        // console.log(text)

        anotHelper.set("text",text)
        annotationTemp = new (annotationTempClass)
        var ann = annotationTemp.obj.clone();
        ann.text = "osomethig"

        // console.log(ann)
        // ann.rotateZ( -Math.PI / 2 );
        ann.rotateY( -Math.PI / 2  );
        // ann.position.set((0.1 + vert.x - frameConfig.width/2) , frameConfig.bandHeight/2 + (ii * frameConfig.bandHeight),- (vert.y - frameConfig.height/2));
        // console.log(ann)
        clbl.geometry = ann.geometry;
        clbl.needsUpdate = true;
        if (counter > 1){
          counter = 0;

        } else {
          counter++;
        }
        // componentTextGroup.add(ann)
      // }

}


      for (var ini=0; ini < textGroup.children.length; ini++){







            var lbl = textGroup.children[ini];

            var text = ui_current_state.get("component")
            anotHelper.set("text",text)
            annotationTemp = new (annotationTempClass)
            var ann = annotationTemp.obj.clone();
            ann.text = "osomethig"

            // console.log(ann)
            // ann.rotateZ( -Math.PI / 2 );
            ann.rotateY( -Math.PI / 4  );
            // ann.position.set((0.2 + street_surf_group.children[vr].geometry.vertices[1].x - frameConfig.width/2) , 0.1,- (street_surf_group.children[vr].geometry.vertices[1].y - frameConfig.height/2));
            // console.log(ann)
            lbl.geometry = ann.geometry;
            lbl.needsUpdate = true;
            // textGroup.add(ann)
      }
    }


    ui_current_state.set("data_needs_to_filter", 0)

    updateViz()
  }
})


  $( '.ui.button#play' ).click(function() {
    ui_current_state.set("play","1")
    ui_current_state.set("slider_decides",0)
    ui_current_state.set("delay", 200)
    requestAnimationFrame(animateScene);
  })
  $( '.ui.button#pause' ).click(function() {
    ui_current_state.set("play","0")
    ui_current_state.set("delay", 3000)
    requestStream.frame_counter += 1;
    $( '.ui.button#play' ).deactive()
    requestAnimationFrame(animateScene);
  })





// var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
formatDate=d3.timeParse("%b %d");;
var margin={top:5,right:1,bottom:1,left:1},width=960-margin.left-margin.right,height=54;
var timeScale=d3.scaleTime().domain([new Date('2012-01-02'),new Date('2013-01-01')]).range([0,width]).clamp(true);
var startValue=timeScale(new Date('2012-03-20'));
var brush=d3.brushX()



var svg=d3.select("#timedatetext").append("g").attr("class","x axis").attr(
  "transform","translate("+margin.left+","+margin.top+")"
)



function brushed(){
  var value=brush.extent()[0];
  if(d3.event.sourceEvent){value=timeScale.invert(d3.mouse(this)[0]);
    brush.extent([value,value]);
  }

}


var time_line_width = 500;
// console.log(scalerConfig)


var time_line = d3.select("#range-speed").append("svg").attr("height", 60).attr("width", time_line_width)



var container = time_line.append("g")


time_line.append("g").attr('transform', 'translate(' + 0 + ',' + 40 + ')').attr("class","timeline").append("rect").attr("height", 1).attr("width", time_line_width);


