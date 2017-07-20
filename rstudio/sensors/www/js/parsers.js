function parseSamples(d) {
  var s_time = parseTime(d.time);
  return {
    time: s_time, // convert "Year" column to Date
    DeviceId: d.DeviceId,
    Base: +d.Base,
    Voice: +d.Voice,
    High: +d.High,
    Leqdba: +d.Leqdba,
    Lmaxdba: +d.Lmaxdba,
    Lmindba: +d.Lmindba
  };
}
function parseLocations(d) {
  return {
    street: d.street,
    lat: d.lat,
    lon:d.lon,
    id: d.id,
    instreet_rank: +d.instreet_rank
  }

}



function filterValuesByTime(timeValue){
  var cutoffDate = d3.utcDay(ui_current_state.get("rangestart"));
  if (timeValue < cutoffDate){
    var cutoffDate = d3.utcDay(ui_current_state.get("rangeend"));
    if (timeValue > cutoffDate){
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }

}

function filterData(){

  var data =[];
  samples_mapped.keys().forEach(function(eachkey){
    var vals = samples_mapped.get(eachkey);
    vals.forEach(function(samplevalue){

    })
  })
  var cutoffDate = d3.utcDay(ui_current_state.get("rangestart"));
  data = data.filter(function(d) {
    return d.time > cutoffDate;
  })
  var cutoffDate = d3.utcDay(ui_current_state.get("rangeend"));
  data = data.filter(function(d) {
    return d.time < cutoffDate;
  })
  return data
}
