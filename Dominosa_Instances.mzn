include "globals.mzn";

int : n;
int : row = n+1;
int : col = n+2;

int : cards = (row*col)div(2);


set of int: row_indices = 1..row;
set of int: col_indices = 1..col;
set of int: card_rows = 1..cards;
set of int: values = 0..n;

array[card_rows,1..2] of values: card;
array[row_indices,col_indices] of var card_rows: temp;


constraint forall(x in 2..row-1, y in 2..col-1)( temp[x,y] == temp[x,y+1] \/ %SottoMatrice senza cornice
                                         temp[x,y] == temp[x-1,y] \/
                                         temp[x,y] == temp[x,y-1] \/
                                         temp[x,y] == temp[x+1,y]
            
);

constraint (temp[1,1] == temp[1,2] \/ temp[1,1] == temp[2,1]) /\ (temp[row,1] == temp[row,2] \/ temp[row,1] == temp[row-1,1]) 
           /\ (temp[1,col] == temp[1,col-1] \/ temp[1,col] == temp[2,col]) /\ (temp[row,col] == temp[row,col-1] \/ temp[row,col] == temp[row-1,col]) ; %Angoli


constraint forall(x in 2..row-1)((temp[x,1] == temp[x-1,1] \/ temp[x,1] == temp[x+1,1]) /\ 
                            (temp[x,col] == temp[x-1,col] \/ temp[x,col] == temp[x+1,col])); %Riga1-RigaN
                            
                            
constraint forall(y in 2..col-1)((temp[1,y] == temp[1,y+1] \/ temp[1,y] == temp[1,y-1]) /\ 
                            (temp[row,y] == temp[row,y+1] \/ temp[row,y] == temp[row,y-1])); %Colonna1-ColonnaN
                            
constraint forall(i in card_rows)(2 = sum(x in row_indices, y in col_indices)(
                (temp[x,y] == i)) 
);
solve satisfy;


      
output [
  show_int(3, temp[i,j]) ++ if j == n+2 then "\n" else " " endif
  | i in row_indices, j in col_indices
];
