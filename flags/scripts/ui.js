
var counter = 0;
$('.ui.radio.checkbox').checkbox({
  onChange: function(){
    val = $(this)[0].id;
    console.log($(this))
    if (ui_current_state.get("component")!= "val"){
        ui_current_state.set("component", val)

        for (var ini=0; ini < componentTextGroup.children.length; ini++){

                var clbl = componentTextGroup.children[ini];


                var text = anotHelper.get(ui_current_state.get("component"))[counter]

                anotHelper.set("text",text)
                annotationTemp = new (annotationTempClass)
                var ann = annotationTemp.obj.clone();
                ann.text = "osomethig"
                ann.rotateY( -Math.PI / 2  );

                clbl.geometry = ann.geometry;
                clbl.needsUpdate = true;
                if (counter > 1){
                  counter = 0;

                } else {
                  counter++;
                }

        }
        for (var ini=0; ini < textGroup.children.length; ini++){
              var lbl = textGroup.children[ini];

              var text = ui_current_state.get("component")
              anotHelper.set("text",text)
              annotationTemp = new (annotationTempClass)
              var ann = annotationTemp.obj.clone();
              ann.text = "osomethig"
              ann.rotateY( -Math.PI / 4  );
              lbl.geometry = ann.geometry;
              lbl.needsUpdate = true;
        }
    }


    ui_current_state.set("data_needs_to_filter", 0)

    updateViz()
    staticAnimate()
  }
})


// $( '.ui.button#play' ).click(function() {
//   ui_current_state.set("play","1")
//   ui_current_state.set("slider_decides",0)
//   ui_current_state.set("delay", 200)
//   requestAnimationFrame(animateScene);
// })
$( '.ui.button#pause' ).click(function() {
  ui_current_state.set("play","0")
  // ui_current_state.set("delay", 3000)
  // requestStream.frame_counter += 1;
  $( '.ui.button#play' ).deactive()
  ui_current_state.set("play","1")
  ui_current_state.set("delay", 20)
  requestAnimationFrame(animateScene);
})

formatDate=d3.timeParse("%b %d");;
var margin={top:5,right:1,bottom:1,left:1},width=window.innerWidth-margin.left-margin.right,height=54;
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


var time_line_width = 400;


var time_line = d3.select("#range-speed").append("svg").attr("id","svgcontainer").attr("height", 50).attr('color', 'white').attr("width", time_line_width)


var container = time_line.append("g")

time_line.attr("class","timeline").append("rect").attr("x", 0).attr("y", 15).attr("height", 1).attr("width", time_line_width).style('color', '#ffffff');
// .attr('transform', 'translate(' + 5 + ',' + 15 + ')')
