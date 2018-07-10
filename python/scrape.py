from bs4 import BeautifulSoup
from urllib.request import urlopen
import re
import pprint
import csv


def location(county, locality):
    return 'http://www.daft.ie/'+county+'/houses-for-sale/'+locality

def format_html_to_xml_soup(url):
    source = urlopen(url).read()
    return BeautifulSoup(source, 'lxml')

def get_number_of_pagination_pages(x):
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
    full_dict_of_data = {}
    
    for page in urls:
        parsed_single_page = format_html_to_xml_soup(page)
        
        # Ber Number
        # ber_number = parsed_single_page.find("div", attrs={"id": "smi-ber-details"}).next_sibling
        # number_from_text = [int(s) for s in ber_number.split() if s.isdigit()]
        
        json_string = re.findall(r"{\W\w.*\W}", parsed_single_page.text)[1].split(',"')
        for i in json_string:
            parsed_list.append(i.replace('"', '').replace('{', '').replace('}', ''))
        
        # split list into 2 lists
        data_key = [i.split(':', 1)[0] for i in parsed_list]
        data_value = [i.split(':', 1)[1] for i in parsed_list]
        # combine 2 lists into dictionary
        dictionary = dict(zip(data_key, data_value))
        # update dictionarry
        # property_area = dictionary.get('property_title').split(', ')[-1]
        # dictionary.update({'ber_number': (number_from_text)[0], 'property_area': property_area})
        full_dict_of_data[page] = dictionary
    
    return full_dict_of_data

# ===================================================================

# URL = location('dublin', 'ranelagh')

# soup = format_html_to_xml_soup(URL)

# number_of_pages = get_number_of_pagination_pages(soup) 

# urls = get_urls_for_each_page(URL, number_of_pages)  


 
sample_data = [
    'http://www.daft.ie/dublin/houses-for-sale/ranelagh/2-elmpark-avenue-ranelagh-dublin-1723164/', 
    'http://www.daft.ie/dublin/houses-for-sale/ranelagh/35-beechwood-avenue-upper-ranelagh-dublin-1720287/',
    'http://www.daft.ie/dublin/houses-for-sale/ranelagh/46-warners-lane-dartmouth-road-ranelagh-dublin-1720285/',
    'http://www.daft.ie/dublin/houses-for-sale/ranelagh/3-rhodaville-place-mount-pleasant-avenue-lower-ranelagh-dublin-1710958/',
] 
        
data = get_data_from_each_page(sample_data)    
   


pp = pprint.PrettyPrinter(indent=4)
print(data)
print(type(data)) 