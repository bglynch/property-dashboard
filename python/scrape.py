# from bs4 import BeautifulSoup
# import re
import pprint
import json
# import urllib3
from functions import location, format_html_to_xml_soup, get_number_of_pagination_pages, get_urls_for_each_page, get_data_from_each_page, parse_the_data, filter_data

print("===================URL======================")
URL = location('dublin', 'dublin-4')
print(URL)


print("===================SOUP======================")
soup = format_html_to_xml_soup(URL)
print(soup)


print("===================SOUP======================")
number_of_pages = get_number_of_pagination_pages(soup)
print(number_of_pages)


print("===================03======================")
urls = get_urls_for_each_page(URL, number_of_pages)
print(urls)


print("===================04======================")
raw_data = get_data_from_each_page(urls)
print(raw_data)


print("===================05======================")
unfiltered_data = parse_the_data(raw_data)
data = filter_data(unfiltered_data)
print(data)

with open('data/cork.json', 'w') as fout:
    json.dump(data, fout, sort_keys=True,indent=4, separators=(',', ': '))

