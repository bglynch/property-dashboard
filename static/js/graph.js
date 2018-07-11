queue()
    .defer(d3.json, "data/sampledata.json")
    .await(makeGraphs);
    
function makeGraphs(error, propertyData){
    var ndx = crossfilter(propertyData);
    
    show_areas_of_properties(ndx);
    show_average_price(ndx);
    show_auctioneer(ndx);
    show_ber_index(ndx);
    show_number_bedrooms(ndx);
    show_number_bathrooms(ndx);
    show_number_filtered(ndx);
    
    dc.renderAll();
}
/*=========================================================ROW CHART - PROPERTY AREAS*/
// "area": "Rathfarnham",
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

/*=========================================================NUMBER - AVERAGE HOUSE PRICE*/
// "price": 350000,
function show_average_price(ndx){
    var averageHousePrice = ndx.groupAll().reduce(
        function (p,v) {
            p.count++;
            p.total += v.price;
            p.average = p.total / p.count;
            return p;
        },
        function (p,v) {
            p.count--;
            if(p.count == 0){ 
                p.total = 0;
                p.average = 0;
                
            }
            else{
                p.total -= v.price;
                p.average = p.total / p.count; 
            }
            return p;
        },
        function () {
            return {count: 0,total: 0,average: 0};
        }
        
    );
    
    dc.numberDisplay("#average_property_price")
        // .formatNumber(d3.format(".2"))
        .valueAccessor(function (d){
            if (d.count == 0){
                return 0;
            }
            else{
                return d.average;
            }
        })
        .group(averageHousePrice)
        ;
}

/*=========================================================BAR CHART - AUCTIONEER*/
// "seller_name": "Sherry FitzGerald Sundrive",
function show_auctioneer(ndx){
    var dim = ndx.dimension(dc.pluck('seller_name'));   
    var group = dim.group();    
    
    dc.barChart('#auctioneer')
        .width(400)
        .height(500)
        .margins({top:10, right:50, bottom:200, left:50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Gender")
        .renderlet(function (chart) {
                chart.selectAll("g.x text")
                .attr('dx', '-30')
                .attr('transform', "translate(-20,0) rotate(-90)");
            })
        ;
}
/*=========================================================BAR CHART - BER CLASS*/
// "seller_name": "Sherry FitzGerald Sundrive",
function show_ber_index(ndx){
    var dim = ndx.dimension(dc.pluck('ber_classification'));   
    var group = dim.group();    
    
    dc.barChart('#ber_value')
        .width(400)
        .height(300)
        .margins({top:10, right:50, bottom:30, left:50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("BER Value")
        
        ;
}

/*=========================================================TABLE - URL, ADDRESS, GOOGLEMAP, PRICE*/

/*=========================================================FILTER - MAXIMUM PRICE*/

/*=========================================================DROP DOWM - TYPE OF HOUSE*/

/*=========================================================LINE CHART - SURFACE AREA VS. PRICE*/

/*=========================================================PIE CHART - BEDROOMS*/
function show_number_bedrooms(ndx){
    var dim = ndx.dimension(dc.pluck('beds'));   
    var group = dim.group();
    
    dc.pieChart("#number_of_beds")
        .height(300)
        .radius(100)
        .dimension(dim)
        .group(group)
        .minAngleForLabel(.2);
}

/*=========================================================PIE CHART - BATHROOMS*/
function show_number_bathrooms(ndx){
    var dim = ndx.dimension(dc.pluck('bathrooms'));   
    var group = dim.group();
    
    dc.pieChart("#number_of_baths")
        .height(300)
        .radius(100)
        .dimension(dim)
        .group(group)
        .minAngleForLabel(.2);
}

/*=========================================================NUMBER CHART - HOW MANY FILTER*/
function show_number_filtered(ndx){
	var group = ndx.groupAll();
    
    dc.dataCount(".dc-data-count")
        .dimension(ndx)
    	.group(group);
}






