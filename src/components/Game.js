import React, { Component, Fragment } from "react";
import Button from 'react-bootstrap/Button';
import Header from "../components/Header";
import Action from "../components/Action";
import Difficulty from "../components/Difficulty";
import Grid from "../components/Grid";
import axios from 'axios';


export default class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            difficulty: 3,
            size_row: 4,
            size_column: 5,
            rows: [0, 1, 2, 3],
            columns: [0, 1, 2, 3, 4],
            value: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            solutions: {},
            cards_user: {},
            cards_toSolve: {},
            changed: false,
            won: false,
            error: false,
            web: false
        };
        this.changeGrid = this.changeGrid.bind(this);
        this.getCardUser = this.getCardUser.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onClickNewGame = this.onClickNewGame.bind(this);
        this.setError = this.setError.bind(this);
        this.setWeb = this.setWeb.bind(this);



    }

    componentDidMount() {
        this.setupGrid(3)
    }

    setWeb() {
        this.setState({ web: !this.state.web }, () => { console.log("web", this.state.web); })
    }
    getCardUser(cards) {

        //console.log(cards);
        this.setState({ cards_user: cards })


    }
    onClickNewGame() {
        this.setState({ changed: true }, () => { this.setupGrid(this.state.difficulty); });
    }

    onClickSubmit() {
        let solve = false;
        console.log(this.state.cards_user);
        console.log(this.state.solutions[0]);
        if (Object.keys(this.state.solutions[0]).length !== Object.keys(this.state.cards_user).length) {
            //console.log(Object.keys(this.state.solutions[0]).length + " " + Object.keys(this.state.cards_user).length);
            this.setState({ error: true })
        } else {
            for (let sol = 0; sol < Object.keys(this.state.solutions).length; sol++) {
                solve = false;
                let cont = 0;
                for (let x = 0; x < Object.keys(this.state.solutions[sol]).length; x++) {
                    let good = false;
                    for (let y = 0; y < Object.keys(this.state.cards_user).length; y++) {
                        //console.log(this.state.cards_user[y] + " " + this.state.solutions[x]);
                        if (this.state.cards_user[y].i === this.state.solutions[sol][x][0] && this.state.cards_user[y].j === this.state.solutions[sol][x][1]) {
                            good = true;
                            cont++;
                        }
                        if (this.state.cards_user[y].i === this.state.solutions[sol][x][1] && this.state.cards_user[y].j === this.state.solutions[sol][x][0]) {
                            good = true;
                            cont++;
                            //console.log(this.state.cards_user[y] + " " + this.state.solutions[x]);
                        }
                    }
                    if (!good) {
                        break;
                    }

                }
                console.log(cont);
                if (cont === Object.keys(this.state.solutions[sol]).length) {
                    solve = true;
                    break;
                }
            }
            if (!solve) {
                this.setState({ error: true })

            } else {
                this.setState({ won: true })
            }

        }
    }

    setError() {
        this.setState({ won: false });
        this.setState({ error: false });
    }

    getList = (value_d, rows_temp, columns_temp, value_col, value_row, web) => {
        const base_url_generator = "http://localhost:5000/generator";
        //const data={​​​​​​​​varName:this.state.varName}​​​​​​​​
        axios.post(base_url_generator, { n: value_d, web: web }).then(response => {
            this.setState({ value: response.data })
            this.setState({ rows: rows_temp })
            this.setState({ columns: columns_temp })
            this.setState({ size_row: value_row })
            this.setState({ size_column: value_col })
            this.setState({ difficulty: value_d })
            this.getSolver()

        })
            .catch(error => {
                console.log(error.response)
            })

    }
    getSolver = () => {
        const base_url_solver = "http://localhost:5000/solver";
        //const data={​​​​​​​​varName:this.state.varName}​​​​​​​​
        axios.get(base_url_solver).then(respo => {
            let tempJSON = JSON.parse(JSON.stringify(respo.data));

            this.setState({ solutions: tempJSON })
            //console.log(this.state.solutions[1][0]);
            console.log(this.state.solutions)
            this.setState({ cards_toSolve: this.state.solutions[0] })

        })
            .catch(error => {
                console.log(error.respo)
            })

    }



    setupGrid(value) {
        this.setState({ error: false });
        this.setState({ changed: false });
        this.setState({ won: false });
        let rows_temp = [];
        let columns_temp = [];
        let value_row = parseInt(value) + 1;
        let value_col = parseInt(value) + 2;

        for (let index1 = 0; index1 < value_row; index1++) {
            rows_temp[index1] = index1;
        }
        for (let index2 = 0; index2 < value_col; index2++) {
            columns_temp[index2] = index2;

        }
        this.getList(value, rows_temp, columns_temp, value_col, value_row, this.state.web);
        //console.log(this.state.value);
    }

    changeGrid = (e) => {


        this.setState({ changed: true }, () => { this.setupGrid(e.target.value); });

        //this.setState({ row: e.target.value });
    }

    render() {
        return (
            <Fragment >
                <div className="scroll">
                    <Header onClickNewGame={this.onClickNewGame} ></Header>

                    <Difficulty className="dominosa_2020_container" changeGrid={this.changeGrid}></Difficulty>
                    <Grid rows={this.state.rows} columns={this.state.columns} cards_toSolve={this.state.cards_toSolve} changed={this.state.changed}
                        size_column={this.state.size_column} value={this.state.value} getCardUser={this.getCardUser} solutions={this.state.solutions}
                        won={this.state.won} error={this.state.error} changeError={this.setError} web={this.state.web} setWeb={this.setWeb}>

                    </Grid>

                    <section>
                        <div id="submit-button" className="status__actions">
                            <Button className="myButton" variant="outline-success" onClick={this.onClickSubmit}>Submit</Button>{' '}

                            {/* <Action action='submit' onClickAction={this.onClickSubmit} />*/}
                        </div>
                    </section>
                </div>
            </Fragment>
        );

    }

}