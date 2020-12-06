from minizinc import Instance, Model, Solver
import numpy as np
from numpy import savetxt
import sys

n = int(sys.argv[1])

s = "n=" + str(n) + ";\n"

s += "card = [|\n"
for i in range(0, n+1):
    for j in range(i, n+1):
        s += "  " + str(i) + "," + str(j) + ",|" + "\n"
        if(i == n and j == n):
            s = s[:-1]
            s+= "];"

chuffed = Solver.lookup("chuffed")

generator = Model("./Dominosa_Instances.mzn")
#generator.add_file("./Dominosa_Instances.dzn")
instance = Instance(chuffed, generator)
instance.add_string(s)
# Find and print all possible solutions
r = instance.solve(all_solutions=False)


m = r['temp']
m = np.array(m,dtype=int)

format = ""
for i in range(0,n+2):
    format+="%i "
#scriviamo su file
np.savetxt('./out.txt',m,fmt=format)