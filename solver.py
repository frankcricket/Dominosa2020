from minizinc import Instance, Model, Solver
import numpy as np
from numpy import savetxt


chuffed = Solver.lookup("chuffed")

generator = Model("./Dominosa_final.mzn")
generator.add_file("./Dominosa.dzn")
instance = Instance(chuffed, generator)
# Find and print all possible solutions
r = instance.solve(all_solutions=False)


m = r['temp']
m = np.array(m,dtype=int)
n = m.shape[0] - 1
format = ""
for i in range(0,n+2):
    format+="%i "
#scriviamo su file
np.savetxt('./solver.txt',m,fmt=format)