import numpy as np
import random
from numpy import loadtxt,savetxt
import sys


#leggiamo su file
matrix = loadtxt('./out.txt')

n = matrix.shape[0] - 1

new_matrix = np.zeros(dtype=int, shape=(n+1,n+2))
cards = int((n+2)*(n+1)/2)
list_cards = list(range(1,cards+1))
value2swap = list(range(1,cards+1))
random.shuffle(value2swap)
cont = 1
for card in range(0,len(list_cards)):
    for i in range(0,n+1):
        for j in range(0,n+2):
            if(matrix[i][j] == list_cards[card]):
                new_matrix[i][j] = value2swap[card]
result = np.zeros(dtype=int, shape=(n+1,n+2))
count = 0

for i in range(0,n+1):
    for j in range(i,n+1):
        count+=1
        trovato = False
        for x in range (0,n+1):
            for y in range (0,n+2):
                if (new_matrix[x][y] == count):
                    if not trovato:
                        trovato = True
                        result[x][y] = i
                    else:
                        result[x][y] = j

format = ""
for i in range(0,n+2):
    format+="%i "
#scriviamo su file
np.savetxt('./result.txt',result,fmt=format)

s = "n=" + str(n) + ";\n"

s += "card = [|\n"
for i in range(0, n+1):
    for j in range(i, n+1):
        s += "  " + str(i) + "," + str(j) + ",|" + "\n"
        if(i == n and j == n):
            s = s[:-1]
            s+= "];"
s += "\nmatrix = [|\n"
for x in range (0,n+1):
    for y in range (0,n+2):
        s+= str(result[x][y]) + ","
        if(y == n+1):
            s+="|\n"
s = s[:-1]
s+= "];"

print(s)
f = open('./Dominosa.dzn','w')
f.write(s)
f.close()
