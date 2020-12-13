import requests
import re
from bs4 import BeautifulSoup
import sys
size = sys.argv[1]
headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
    }

url_games = {
    "3" : "https://www.puzzle-dominosa.com/",
    "4" : "https://www.puzzle-dominosa.com/?size=6",
    "5" : "https://www.puzzle-dominosa.com/?size=7",
    "6" : "https://www.puzzle-dominosa.com/?size=1",
    "7" : "https://www.puzzle-dominosa.com/?size=8",
    "8" : "https://www.puzzle-dominosa.com/?size=9",
    "9" : "https://www.puzzle-dominosa.com/?size=2",
    "15" : "https://www.puzzle-dominosa.com/?size=3",
    "20" : "https://www.puzzle-dominosa.com/?size=4",
    "25" : "https://www.puzzle-dominosa.com/?size=10",
    "30" : "https://www.puzzle-dominosa.com/?size=5",
    "40" : "https://www.puzzle-dominosa.com/?size=11"
}
url = url_games[size]
n = int(size)
req = requests.get(url, headers, timeout=50)
soup = BeautifulSoup(req.content, 'html.parser')

task =""

pattern = re.compile(".*task = '((\\[)?\\d*(\\])?.*?)'")
for i in soup.findAll("script", {"type": "text/javascript"}):
    content = i.contents[0]
    matches = re.findall(pattern, content)
    if matches: 
        #print(matches[0][0])
        task = matches[0][0]
        break
line_size=n+2
j=0
value=""
multiple_digits = False
print_value = "True"
stringOut = "matrix = [|\n"
react_matrix = "["
for i,s in enumerate(task):

    if(multiple_digits):
        value+=s
    if(s=="["):
        multiple_digits=True
        print_value=False
    elif(s=="]"):
        multiple_digits=False
        print_value=True
        value=value[:-1]
        #print("HERE ", value)
    elif(not multiple_digits):
        print_value=True
        value=s
    
    
    if(print_value):
        stringOut += str(value) + ","
        react_matrix += str(value) + ","
        #print(value, ",", end='', sep='')
        j+=1
        value=""
        if(j==line_size):
            j=0
            stringOut += "|"
            #print("|", end='', sep='')
            if(len(task)-1==i):
                stringOut += "];\n"
                #print("];")
            else:
                stringOut += "\n"
                #print("")
        
        

#print("\n", "card = [|")
s = "n=" + str(n) + ";\n"

s += "card = [|\n"
for i in range(0, n+1):
    for j in range(i, n+1):
        s += "  " + str(i) + "," + str(j) + ",|" + "\n"
        if(i == n and j == n):
            s = s[:-1]
            s+= "];"
stringOut += "\n" + s


f = open('./scripts/minizinc/Dominosa.dzn','w')
f.write(stringOut)
f.close()


react_matrix = react_matrix[:-1]
react_matrix += "]"
print(react_matrix)
sys.stdout.flush()