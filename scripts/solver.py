from minizinc import Instance, Model, Solver
import numpy as np
from numpy import savetxt
import sys
import json


chuffed = Solver.lookup("chuffed")

generator = Model("./scripts/minizinc/Dominosa_final.mzn")
generator.add_file("./scripts/minizinc/Dominosa.dzn")
instance = Instance(chuffed, generator)
# Find and print all possible solutions
r = instance.solve(all_solutions=True)


#m = r['temp']
#m = np.array(m,dtype=int)
#n = m.shape[0] - 1
list_sol = []
for i in range(0,len(r)):
    list_sol.append(np.array(r[i,'temp']).flatten());

dictionary_all_solutions = {}
for index, solution in enumerate(list_sol):
    cont = 0;
    dictonary_cards = {}
    for i in range(1,int((len(solution)/2) + 1)):
        count = 0
        first = -1
        for x in range (0,len(solution)):
            if(solution[x] == i):
                if(count == 0):
                    first = x
                    count+=1
                else:
                    dictonary_cards[cont] = [first,x]
                    cont+=1
    
    dictionary_all_solutions[index] = dictonary_cards;       

pp_json = json.dumps(dictionary_all_solutions)
print(pp_json)
sys.stdout.flush()