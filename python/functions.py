from bs4 import BeautifulSoup
from urllib.request import urlopen
import re
import pprint
import json


def location(county, locality):
    return 'http://www.daft.ie/'+county+'/houses-for-sale/'+locality

def format_html_to_xml_soup(url):
    source = urlopen(url).read()
    return BeautifulSoup(source, 'lxml')

def get_number_of_pagination_pages(soup):
    number_properties = soup.find(id="sr-sort").next_sibling.next_sibling.next_sibling.next_sibling.string
    x = list(number_properties)
    y=""
    for char in x:
        if char.isdigit():
            y+=char
    number_of_pages = (int(y)//20)*20
    return number_of_pages

def get_urls_for_each_page(url, number_of_pages):
    urls=[]
    while number_of_pages>=0:
        paginated_page = url+'/?offset='+str(number_of_pages)
        soup = format_html_to_xml_soup(paginated_page)
        divs = soup.find_all('div', class_="search_result_title_box")
        
        for div in divs:
            a=div.find('a')
            urls.append("http://www.daft.ie" + a['href'])
        
        print(urls)
        number_of_pages -= 20
    return urls

def get_data_from_each_page(urls):
    parsed_list = []
    full_dict_of_data = []
    
    for page in urls:
        parsed_single_page = format_html_to_xml_soup(page)
        
        # Ber Number
        # ber_number = parsed_single_page.find("div", attrs={"id": "smi-ber-details"}).next_sibling
        # number_from_text = [int(s) for s in ber_number.split() if s.isdigit()]
        
        json_string = re.findall(r"{\W\w.*\W}", parsed_single_page.text)[1].split(',"')
        for i in json_string:
            parsed_list.append(i.replace('"', '').replace('{', '').replace('}', ''))
        
        # split list into 2 lists
        dictionary_keys = [i.split(':', 1)[0] for i in parsed_list]
        dictionary_values = [i.split(':', 1)[1] for i in parsed_list]
        # combine 2 lists into dictionary
        dictionary = dict(zip(dictionary_keys, dictionary_values))
        dictionary['url'] = page
        full_dict_of_data.append(dictionary)
    
    return full_dict_of_data

def parse_the_data(data):
    for v in data:
        del v['environment']
        del v['platform']
        del v['currency']
        del v['ad_ids']
        if 'price' in v:
            v['price'] = int(v['price'])
        else:
            v['price'] = "Not Given"
        v['longitude'] = float(v['longitude'])
        v['latitude'] = float(v['latitude'])
        if 'surface' in v:
            v['surface'] = float(v['surface'])
        else:
            v['surface'] = "Not Given"
        v['beds'] = int(v['beds'])
        v['seller_id'] = int(v['seller_id'])
        v['bathrooms'] = int(v['bathrooms'])
        v['no_of_photos'] = int(v['no_of_photos'])
        v['facility'] = (v['facility']).split(",")
    return data

def filter_data(list_of_dict_data):
  updated_list = []
  for v in list_of_dict_data:
    if v['surface'] != "Not Given" and v['price'] != "Not Given":
      updated_list.append(v)
      
  return updated_list