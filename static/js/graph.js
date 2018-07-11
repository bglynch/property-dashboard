queue()
    .defer(d3.json, "data/sampledata.json")
    .await(makeGraphs);
    
function makeGraphs(error, propertyData){
    var ndx = crossfilter(propertyData);
    
    show_areas_of_properties(ndx);
    
    dc.renderAll();
}

function show_areas_of_properties(ndx){
    var dim = ndx.dimension(dc.pluck('area'));
    var group = dim.group();
    
    var chart = dc.rowChart("#areas_of_properties")
        .width(600)
        .height(330)
        .dimension(dim)
        .group(group)
        .xAxis().ticks(4);
}