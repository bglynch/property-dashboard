from bs4 import BeautifulSoup
import urllib3
import re

def location(county, locality):
    return 'http://www.daft.ie/'+county+'/houses-for-sale/'+locality


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

def parse_the_data(data):
    for v in data:
        print(v)
        if 'environment' in v:
            del v['environment']
        if 'platform' in v:
            del v['platform']
        if 'currency' in v:
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
        for v in data:
            if v['seller_name'].split(" ")[0] == "Sherry":
                v['seller_name'] = "Sherry Fitzgerald"
            elif v['seller_name'].split(" ")[0] == "DNG":
                v['seller_name'] = "DNG"
            elif v['seller_name'].split(" ")[0] == "Lisney":
                v['seller_name'] = "Lisney"
            elif v['seller_name'].split(" ")[0] == "Quillsen":
                v['seller_name'] = "Quillsen"
            elif v['seller_name'].split(" ")[0] == "Hunters":
                v['seller_name'] = "Hunters"
            elif v['seller_name'].split(" ")[0] == "Savills":
                v['seller_name'] = "Savills"
            elif v['seller_name'].split(" ")[0] == "HWP":
                v['seller_name'] = "HWP Property"
            elif v['seller_name'].split(" ")[0] == "Hassett":
                v['seller_name'] = "Hassett and Fitzsimons"
            elif v['seller_name'].split(" ")[0] == "Lynam":
                v['seller_name'] = "Lynam Estate Agents"
            elif v['seller_name'] == "Property Partners O'Brien Swaine Dundrum":
                v['seller_name'] = "HO'Brien Swaine"
            else:
                v['seller_name'] = v['seller_name']
    return data

def filter_data(list_of_dict_data):
  updated_list = []
  for v in list_of_dict_data:
    if v['surface'] != "Not Given" and v['price'] != "Not Given":
      updated_list.append(v)
      
  return updated_list