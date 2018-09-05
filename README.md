# Property Dashboard - South Dublin, Ireland
For a live version of the website click [**HERE**](https://bglynch.github.io/property-dashboard/)

## Overview

### Who is the website for?
The current version of the website is for people who have an interest in the property market in South Dublin. 
This includes persons looking to buy or sell there home, property auctioneers or builders looking to flip a property.

### What does it do?
This website gives a graphical representation of houses for sale in the form of an interactive data dashboard.  
It allows the user to filter on data points of interest to them. The user can select data in one chart to apply a filter to all charts on the dashboard. 

### How does it work?

Building this project involved a 2 part process:
1.  Using python to scrape data from [Daft.ie](https://www.daft.ie/).  
    Daft.ie is Ireland's largest property website. 9 out of every 10 properties for sale in Ireland are advertised on Daft.ie.
2.  Using JavaScript libraries to visualise the dataset

## Building the Website
### Obtaining the Dataset
To perform the web scraping **Python 3** was used with **Beautifulsoup** and **urllib3**.  
[Here](docs/functions.md) is a link to documentation describing the functions I have written to scrape daft.ie and collect the data.

### Displaying the Dataset  
The dataset is displayed as a dashboard of interactive charts. This was done using a mix of technologies.  
The website is styled with **Bootstrap**.  
The charts are drawn and made interactive using **D3.js**, **dc.js** and **Crossfilter.js**. 
**queue.js** is also utilised to ensure that the dataset is loaded before the browser creates the charts.

- [**Bootstrap**](https://getbootstrap.com/) - Front-end framework for faster and easier web development  
- [**D3.js**](https://d3js.org/) - JavaScript library for manipulating documents based on data using HTML, SVG, and CSS  
- [**dc.js**](https://dc-js.github.io/dc.js/) - Javascript charting library with native crossfilter support. . It leverages D3.js to render charts in CSS-friendly SVG format.
- [**Crossfilter.js**](http://square.github.io/crossfilter/) - JavaScript library for multidimensional filtering and aggregation of tabular data.

## Folders and Files Structure
- **./data**  
    Contains existing datasets  
    Once scraped, new datasets are saved here. Choosing the new filname for the dataset can be done on _**line 38** of **./pyhton/scrape.py**_
- **./docs**  
    Contains documentation files to support the ReadMe
- **./python**  
    Contains python scraping files. (Written in python3)
- **./static**
    - **/css**  
    Contain css styling files
    - **/images**  
    Contains images displayed on the website
    - **/js**  
    Contains all javascript files for the website
- **./index.html**

## Installation
Follow the below instructions to get this project up & running locally on a Mac (commands will be slightly different for Windows)  
[Cloning a repository](https://help.github.com/articles/cloning-a-repository/)

## Deployment and Hosting
This website was deployed using github pages

## Testing
This Application was tested manually across a range of browsers on multiple devices.  
I also ask friends and family to act as user to test the site and provide frredback on defensivive design and user experience. I created user scenarios for them to follow.

An example of this is:  
>I am searching for a house in the Ranalagh/Rathmines area and I have a budget of €900,000. I would like to know the properties availble in this location for this budget and have links to a number of properties I can view.  

>I am a property developer and I am in the process of buying a house in Harold's Cross to renovate and add an extension. I would like to know to average value of a property per m2 in Harold's Cross so I can estimate the potential value of the complete house if I undertake this project.

[WebPageTest](https://www.webpagetest.org/) - Testing the website preformance  
[Lighthouse Chrome Extension](https://developers.google.com/web/tools/lighthouse/) - performance, quality, and correctness of your web app  

I also used the following validators to validate my code.  
[W3C](https://validator.w3.org/) - HTML markup validator  
> Warning was thrown by the HTML validation about a ```<section>``` and ```<article>``` not having a header. This wasn't relevent to the design of my site. 

[W3C](http://jigsaw.w3.org/css-validator/) - CSS markup validator  
> The CSS validator raised an error about two hex values ```#ff980070``` and ```#00000047``` being longer than the 6 character format. However, I am intentionally using this value so transparency can be applied

## Issues
Given that the data is collected via. web scraping, the code is succeptible to breaking if the html layout of the scraped web page is altered. 
The current version is working as of the most recent commit of the **python/scrape.py** file.  
Some of the links to the properties in the table might expire due to the property being removed form Daft.ie

## Content
The content in the app is for educational use only


## UX
This website has been developed to be used in desktop only.  
Although this could have been developed for mobile, it was thought the UX would be clunky.  
It was also thought that some of the charts may be difficult to interact with on a small screen.  

The visual aspect of this website was designed to be clean and simple.  

### Colour and Images

The colour pallette of white, blue and orange was based from the Daft.ie logo.  
<img src="https://c1.dmstatic.com/b0b130481f139258589f1/frontend/images/logo@2x.png" height="50px"/>  

The images chosen for the website were also based on this colour pallette. 

The first image matches with the theme of housing and charts.  
<img src="https://github.com/bglynch/property-dashboard/blob/master/static/images/Property-Market-min-1920x480.jpeg?raw=true" height="102px"/>   

The second image is an picture of Dublin's iconic Ringsend towers, used as the dataset was based on South Dublin.  
<img src="https://github.com/bglynch/property-dashboard/blob/master/static/images/dublinBay.jpg?raw=true" height="150px"/>    

### User Flow
The webpage is split into two halves. Using a full width image for the division.  

The first section of the dashboard is a set of pie charts and bar charts that the user clicks on to apply a filtered search to what they are looking for. Once the user has chosen their filters they scroll down to the second section.

Here thet will find several charts that give them information of the properties available. Here is a short description of each chart: 

##### Auctioneer
Simple chart that shows the most popular auctioneer in the area. Useful for contact information as they may have more properties in the area that are not availble on Daft.ie.

##### Average House Price
Gives an average house price for the filtered selection.
Useful as a rough pricing guide.

##### Price per m2
The the average price of a property per m2. May be useful for estimating the potential value of a renovated house if one was to purchase a 'fixer-upper' property.

##### Bubble Chart (What is the Average House Price for an Area?)
This is a 4 dimensional chart, although only 3 dimensions are utilised.
This is a useful chart for getting a quick visual representation of the average house price of each area.  
1st dimension: Y axis, number of properties listed  
2nd dimension: X axis, average house price  
3rd dimension: bubble, property area  
4th dimension: radius of the bubble, average house price 


##### Scatter Plot (What is the Correlation between House Price and Floor Area?)
Shows an individual data point for each property and plots it on the X and Y axis.  
As can be seen there is a rough correlation of price vs. area.
If there is a trend line between house price and floor area a user can see what properties might be deemed better value as they would fall below this line.

##### Box Plot (What is the Price Spread for an Area?)
Gives a more accurate indication of the average house price in each area.

##### Table
Shows a table of the filtered properties.  
There is a link to view the properties on Daft.ie. Also, is a link to view the properties location on Google Maps. This gives the user the ability to quickly view the house and surroundings from an arial view and from Google Street View.

## Credits
Regular Expressions - [regex101](https://regex101.com/)
