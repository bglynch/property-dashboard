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
    show_seller_type(ndx);
    show_selling_type(ndx);
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

/*=========================================================PIE CHART - PROPERTY TYPE*/
function show_property_type(ndx){
    var dim = ndx.dimension(dc.pluck('property_type'));   
    var group = dim.group();
    
    dc.pieChart("#property_type")
        .height(300)
        .radius(100)
        .dimension(dim)
        .group(group)
        .minAngleForLabel(.2);
}
/*=========================================================SELLER - PROPERTY TYPE*/
function show_seller_type(ndx){
    var dim = ndx.dimension(dc.pluck('seller_type'));   
    var group = dim.group();
    
    dc.pieChart("#seller_type")
        .height(300)
        .radius(100)
        .dimension(dim)
        .group(group)
        .minAngleForLabel(.2);
}
/*=========================================================SELLING - PROPERTY TYPE*/
function show_selling_type(ndx){
    var dim = ndx.dimension(dc.pluck('selling_type'));   
    var group = dim.group();
    
    dc.pieChart("#selling_type")
        .height(300)
        .radius(100)
        .dimension(dim)
        .group(group)
        .minAngleForLabel(.2);
}
/*=========================================================OPEN VIEWING*/
function show_selling_type(ndx){
    var dim = ndx.dimension(dc.pluck('open_viewing'));   
    var group = dim.group();
    
    dc.pieChart("#open-viewing")
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

/*=========================================================BUBBLE CHART - NUMBER OF HOUSES VS AVG HOUSE PRICE PER LOCATION*/
// "price": 350000,
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
        .width(990)
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
        .width(800)
        .height(400)
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
                .margins({top: 10, right: 80, bottom: 30, left: 80})
                .dimension(areaDim)
                .group(areaGroup)
                .x(d3.scale.ordinal())
                .elasticY(true)
                // .yAxisPadding(500000)
                // .xAxisPadding(4000000)
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
                    .size(Infinity)
                    .columns([
                        {
                            label: "View Advert",
                            format: function (d) {
                                return `
                                    <a href="${d.url}" target="_blank">
                                        Link
                                    </a>`;
                            }
                        },
                        "area"
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


