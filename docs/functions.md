# Functions Used

```python
def location(county, locality)
```
Used to create a url.  
Arguements: 2 strings.  
Returns: (string) **base url** for scraping. Example in image below
<img src="https://github.com/bglynch/property-dashboard/blob/master/docs/daft-01.jpeg?raw=true" alt="image of daft url" height="100px"/>

```python
def format_html_to_xml_soup(url)
```
Used to create Beautifulsoup object, which represents the document as a nested data structure.  
Arguements:  **base url**  
Returns:  (bs4.Beautifulsoup) **soup**

---
```python
def get_number_of_pagination_pages(soup)
```
Used to get number of properties for a given search rounded down to the nearest 20.  
Required to get past the issue of pagination when scraping.  
Arguements:  **soup**  
Returns:  (integer) **number of properties**


---
```python
def get_urls_for_each_page(url, number_of_pages)
```
Used to get the url for each individual property for a given search.  
Arguements:  **base url**,**number of properties**  
Returns:  (list) **list of urls**

---
```python
def get_data_from_each_page(urls)
```
Used to get the raw dataset for the properties.  
This function uses a regular expression to extract the data. ```import re```   
Arguements:  **list of urls**  
Returns:  (list) **list of urls**

---
```python
def parse_the_data(data)
```
Used to parse out unwanted data or alter data to a format required.  
Arguements:  **list of urls**  
Returns:  (dict) **dictionary of data**

---
```python
def filter_data(list_of_dict_data)
```
Used to filter out data for properties where values are ommited.  
Arguements:  **dictionary of data**  
Returns:  (dict) **dictionary of data**
---
Once this **dictionary of data** is available it is written to a json file.```import json```
```python
with open('data/filename.json', 'w') as fout:
    json.dump(data, fout, sort_keys=True,indent=4, separators=(',', ': '))
```
```filename``` : variable for the name of the new dataset