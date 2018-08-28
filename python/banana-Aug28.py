from bs4 import BeautifulSoup
import re
import pprint
import json
import urllib3

urls = [
    'https://www.daft.ie/dublin/houses-for-sale/terenure/20-mount-tallant-avenue-terenure-dublin-1659688/'
]

def format_html_to_xml_soup(url):
    http = urllib3.PoolManager()
    response = http.request(
    'GET', 
    url,
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3)',
        'Accept-Language': 'en-US',
        'Accept-Encoding': 'text/html'
    })
    return BeautifulSoup(response.data, 'lxml')

def get_data_from_each_page(urls):
    parsed_list = []
    full_dict_of_data = []
    
    for page in urls:
        parsed_single_page = format_html_to_xml_soup(page)
        
        f = open("newfile.txt", "w")
        f.write(str(parsed_single_page))
        f.close()
        
        # Ber Number
        # ber_number = parsed_single_page.find("div", attrs={"id": "smi-ber-details"}).next_sibling
        # number_from_text = [int(s) for s in ber_number.split() if s.isdigit()]
        json_string = re.findall(r"{\"\w.*\"}", parsed_single_page.text)[0].split(',"')
        for i in json_string:
            parsed_list.append(i.replace('"', '').replace('{', '').replace('}', ''))
        
        # split list into 2 lists
        dictionary_keys = [i.split(':', 1)[0] for i in parsed_list]
        dictionary_values = [i.split(':', 1)[1] for i in parsed_list]
        # combine 2 lists into dictionary
        dictionary = dict(zip(dictionary_keys, dictionary_values))
        dictionary['url'] = page
        # dictionary['dist_to_city'] = parsed_single_page.find('h3',text="Distance to City Centre:").next_sibling.split(" km")[0]
        # dictionary['dublin_region'] = re.findall(r"Dublin \d{1,2}", parsed_single_page.text)[0]
        full_dict_of_data.append(dictionary)
    
    return full_dict_of_data

raw_data = get_data_from_each_page(urls)
print(raw_data)

