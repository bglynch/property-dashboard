/* global crossfilter, dc, d3, queue, $ */

queue()
    .defer(d3.json, "data/sampledata.json")
    .await(makeGraphs);
    
function makeGraphs(error, propertyData){
    var ndx = crossfilter(propertyData);
    
    propertyData.forEach(function(d){
        // d.surface = parseFloat(d.surface);
        // d.price = parseInt(d["price"]);
    });
    
    show_areas_of_properties(ndx);
    show_average_price(ndx);
    show_auctioneer(ndx);
    show_ber_index(ndx);
    
    show_number_bedrooms(ndx);
    show_number_bathrooms(ndx);
    show_property_type(ndx);

    show_selling_type(ndx);
    
    show_number_filtered(ndx);
    show_price_to_floor_area(ndx);
    show_avg_house_price(ndx);
    show_bp_area_vs_price(ndx);
    
    show_table_of_properties(ndx);
    
    dc.renderAll();
}
/*=========================================================ROW CHART - PROPERTY AREAS*/
// "area": "Rathfarnham",
function show_areas_of_properties(ndx){
    var dim = ndx.dimension(dc.pluck('area'));
    var group = dim.group();
    
    dc.rowChart("#areas_of_properties")
    
        .width(600)
        .height(330)
        .dimension(dim)
        .group(group)
        .elasticX(true)
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
function show_auctioneer(ndx){
    var dim = ndx.dimension(dc.pluck('seller_name'));   
    var group = dim.group();    
    
    dc.rowChart('#auctioneer')
        .width(600)
        .height(330)
        .dimension(dim)
        .group(group)
        .elasticX(true)
        .cap(10)
        .xAxis().ticks(4);
}

/*=========================================================BAR CHART - BER CLASS*/
function show_ber_index(ndx){
    var dim = ndx.dimension(dc.pluck('ber_classification'));   
    var group = dim.group();    
    var fakeGroup = remove_empty_bins(group);
    
    dc.barChart('#ber_value')
        .width(450)
        .height(330)
        .dimension(dim)
        .group(fakeGroup)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .elasticY(true)
        .transitionDuration(1000)
        .xUnits(dc.units.ordinal);
}
function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value != 0;
            });
        }
    };
}

/*=========================================================PIE CHART */
function show_number_bedrooms(ndx){
    var dim = ndx.dimension(dc.pluck('beds'));   
    var group = dim.group();
    
    dc.pieChart("#number_of_beds")
        .height(300)
        .radius(100)
        .transitionDuration(100)
        .dimension(dim)
        .group(group)
        .minAngleForLabel(.2);
}
function show_number_bathrooms(ndx){
    var dim = ndx.dimension(dc.pluck('bathrooms'));   
    var group = dim.group();
    
    dc.pieChart("#number_of_baths")
        .height(300)
        .radius(100)
        .transitionDuration(1000)
        .dimension(dim)
        .group(group)
        .minAngleForLabel(.2);
}
function show_property_type(ndx){
    var dim = ndx.dimension(dc.pluck('property_type'));   
    var group = dim.group();
    
    dc.pieChart("#property_type")
        .height(300)
        .radius(100)
        .transitionDuration(1000)
        .dimension(dim)
        .group(group)
        .minAngleForLabel(.2);
}
function show_selling_type(ndx){
    var dim = ndx.dimension(dc.pluck('open_viewing'));   
    var group = dim.group();
    
    dc.pieChart("#open-viewing")
        .height(300)
        .radius(100)
        .transitionDuration(1000)
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

/*=========================================================BUBBLE CHART - NUMBER OF HOUSES VS AVG HOUSE PRICE PER LOCATION*/
function show_avg_house_price(ndx){
    var areaDim = ndx.dimension(dc.pluck('area'));
    var statsByArea = areaDim.group().reduce(
        // increase counter
        function (p,v) {
            p.count++; p.total += v.price; p.average = p.total / p.count;
            return p;
        },
        
        // decrease counter
        function (p,v) {
            p.count--;
            if(p.count == 0){ 
                p.total = 0; p.average = 0;}
            else{
                p.total -= v.price; p.average = p.total / p.count; }
            return p;
        },
        // waanted results
        function () {
            return {count: 0,total: 0,average: 0};
        }
        
    );

    
    dc.bubbleChart("#bubble_chart")
        .width(1000)
        .height(400)
        .margins({top: 10, right: 50, bottom: 30, left: 60})
        .dimension(areaDim)
        .group(statsByArea)
        .keyAccessor(function (p) {return p.value.average;})
        .valueAccessor(function (p) {return p.value.count;})
        .radiusValueAccessor(function (p) {
            return p.value.average;
        })
        .x(d3.scale.linear().domain([0, 5000000]))
        .r(d3.scale.linear().domain([0, 5000000]))
        .minRadiusWithLabel(15)
        .elasticY(true)
        .yAxisPadding(10)
        .elasticX(true)
        .yAxisLabel("No. House Available")
        .xAxisLabel("Average House Price")
        .xAxisPadding(500000)
        .maxBubbleRelativeSize(0.07);
}

/*=========================================================SCATTER PLOT - HOUSE PRICE VS FLOOR AREA*/
function show_price_to_floor_area(ndx){
    var areaDim = ndx.dimension(dc.pluck("surface"));
    var priceDim = ndx.dimension(function(d){
        return [d.surface, d.price];
    });
    var xGroup = priceDim.group();
    
    var minArea = areaDim.bottom(1)[0].surface;
    var maxArea = areaDim.top(1)[0].surface;
    
    dc.scatterPlot("#surface_price")
        .width(1000)
        .height(500)
        .x(d3.scale.linear().domain([minArea, maxArea+0.1*maxArea]))
        .symbolSize(5)
        .clipPadding(5)
        .yAxisLabel("Price")
        .xAxisLabel("Surface Area (m2)")
        .title(function(d){
            return "Hello" + d.key[1];
        })
        .dimension(priceDim)
        .group(xGroup)
        .rescale(true)
        .yAxisPadding(200000)
        .margins({top:10, right:50, bottom:50, left:100});
}

/*=========================================================BOX PLOT - AREA VS PRICE*/
function show_bp_area_vs_price(ndx){
            var areaDim = ndx.dimension(dc.pluck('area'));
            var areaGroup = areaDim.group().reduce(
                function(p,v) {
                    p.push(v.price/1000);
                    return p;
                },
                function(p,v) {
                    p.splice(p.indexOf(v.price/1000), 1);
                    return p;
                },
                function() {
                    return [];
                }
            );

            dc.boxPlot("#box-plot-area-vs-price")
                .width(1000)
                .height(400)
                .margins({top: 20, right: 80, bottom: 30, left: 80})
                .dimension(areaDim)
                .group(areaGroup)
                .x(d3.scale.ordinal())
                .elasticY(true)
                .yAxisPadding(200)
                .xUnits(dc.units.ordinal);    
}
/*=========================================================TABLE*/

function show_table_of_properties(ndx){
    const ITEMS_PER_PAGE = 20;
    var offset = 0;
    var filteredTotal = ndx.groupAll();
    var previousFilteredTotalValue = filteredTotal.value();
    var studentDim = ndx.dimension(dc.pluck('url'));
    
    var table = dc.dataTable("#results-table")
                    .dimension(studentDim)
                    .group(function(d){
                        return '';
                    })
                    .width(500)
                    .size(Infinity)
                    .columns([
                        {
                            label: "View Advert",
                            format: function (d) {return `<a href="${d.url}" target="_blank">Daft.ie Link</a>`;}
                        },
                        {
                            label: "Location",
                            format: function(d) { return '<a href=\"http://maps.google.com/maps?z=11&t=m&q=loc:' + d.latitude + '+' + d.longitude +"\" target=\"_blank\">Google Map</a>"}},
                        "area",
                        "price",
                        "surface",
                        
                    ]
                );
    
    function updatePaginationElements() {
        d3.select('#begin').text(offset);
        d3.select('#end').text(
            Math.min(offset+ITEMS_PER_PAGE-1, filteredTotal.value()));
        d3.select('#size').text(filteredTotal.value());
        d3.select('#previous').attr(
            'disabled', offset <= 0 ? "true" : null);
        d3.select('#next').attr(
            'disabled', offset + ITEMS_PER_PAGE >= filteredTotal.value() ? "true" : null);
    }

    function updateTable() {
        table.beginSlice(offset);
        table.endSlice(offset+ITEMS_PER_PAGE);
        updatePaginationElements();
    }
    updateTable();

    function revertToFirstPageIfNeeded() {
        if (filteredTotal.value() !== previousFilteredTotalValue) {
            offset = 0;
            previousFilteredTotalValue = filteredTotal.value();
            updateTable();
            table.redraw();
        }
    }
    table.on('renderlet', revertToFirstPageIfNeeded);

    function next() {
        offset += ITEMS_PER_PAGE;
        updateTable();
        table.redraw();
    }
    $('#next').on('click', next)
    function previous() {
        offset -= ITEMS_PER_PAGE;
        updateTable();
        table.redraw();
    }
    $('#previous').on('click', previous)    
    
}


