queue()
    .defer(d3.json, "data/sampledata.json")
    .await(makeGraphs);
    
function makeGraphs(error, propertyData){
    
}