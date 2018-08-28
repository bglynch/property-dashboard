# from bs4 import BeautifulSoup
# import re
import pprint
import json
# import urllib3
from functions import location, format_html_to_xml_soup, get_number_of_pagination_pages, get_urls_for_each_page, get_data_from_each_page, parse_the_data, filter_data

print("===================URL======================")
URL = location('dublin-city', 'dublin-4')
print(URL)


print("===================SOUP======================")
soup = format_html_to_xml_soup(URL)


print("===================SOUP======================")
number_of_pages = get_number_of_pagination_pages(soup)


print("=========================================")
print(type(URL))
print(type(soup))
print(type(number_of_pages))