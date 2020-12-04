include "globals.mzn";

int : n;
int : row = n+1;
int : col = n+2;

int : cards = (row*col)div(2);


set of int: row_indices = 1..row;
set of int: col_indices = 1..col;
set of int: card_rows = 1..cards;
set of int: values = 0..n;

array[row_indices,col_indices] of values: matrix;
array[card_rows,1..2] of values: card;
array[row_indices,col_indices] of var card_rows: temp;


constraint forall(i in card_rows)(1 = sum(x in 1..row-1, y in col_indices where 
                           (matrix[x,y] == card[i,1] /\ matrix[x+1,y] == card[i,2]) \/ (matrix[x,y] == card[i,2] /\ matrix[x+1,y] == card[i,1]))
                           (temp[x,y] == i /\ temp[x+1,y] == i)  + 
                                   sum(x in row_indices, y in 1..col-1 where 
                           (matrix[x,y] == card[i,1] /\ matrix[x,y+1] == card[i,2]) \/ (matrix[x,y] == card[i,2] /\ matrix[x,y+1] == card[i,1]))
                           (temp[x,y] == i /\ temp[x,y+1] == i ) 
                                
);
solve satisfy;


           
output [
  show_int(3, temp[i,j]) ++ if j == n+2 then "\n" else " " endif
  | i in row_indices, j in col_indices
];
