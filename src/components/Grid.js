import React, { Component } from "react";
import Action from "../components/Action";
import Mode from "../components/Mode";
import Timer from "../components/Timer";
import Confetti from 'react-dom-confetti';

const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

export default class Grid extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cards: {},
            selectedCell: -1,
            init: true,
            erase: false,
        };

        this.onClickSolve = this.onClickSolve.bind(this);
        this.onClickHint = this.onClickHint.bind(this);
        this.onClickErase = this.onClickErase.bind(this);
        this.setGroup = this.setGroup.bind(this);
        this.getCard = this.getCard.bind(this);
        this.changeError = this.changeError.bind(this);
        this.onClickWebMode = this.onClickWebMode.bind(this);
    }

    componentWillReceiveProps() {
        if (this.props.changed)
            this.setState({ cards: {} }, () => { this.props.getCardUser(this.state.cards); });
    }

    onClickWebMode() {

        this.props.setWeb();
    }
    onClickHint() {

        let max = 0;
        let indexSol = 0;
        let realIndexUserCommon = []
        for (let sol = 0; sol < Object.keys(this.props.solutions).length; sol++) {
            let count = 0;
            let indexCardUserCommon = []
            for (let x = 0; x < Object.keys(this.props.solutions[sol]).length; x++) {
                for (let i = 0; i < Object.keys(this.state.cards).length; i++) {

                    if ((this.props.solutions[sol][x][0] === this.state.cards[i].i && this.props.solutions[sol][x][1] == this.state.cards[i].j) ||

                        (this.props.solutions[sol][x][0] == this.state.cards[i].j && this.props.solutions[sol][x][1] == this.state.cards[i].i)) {

                        count++;
                        indexCardUserCommon.push(x);

                    }
                }
            }
            if (count > max) {
                max = count;
                indexSol = sol;
                realIndexUserCommon = indexCardUserCommon;
            }
        }
        console.log("There are ", max, "elements in common ", indexSol)
        let indexCardsSol = 0;
        let size = Object.keys(this.props.solutions[0]).length;
        for (let index = 0; index < size; index++) {
            if (!realIndexUserCommon.includes(index)) {
                indexCardsSol = index;
                break;
            }

        }
        let first = this.props.solutions[indexSol][indexCardsSol][0];
        let second = this.props.solutions[indexSol][indexCardsSol][1];
        let indexToDelete = [];
        //console.log(indexCardsSol);
        for (let i_ = 0; i_ < Object.keys(this.state.cards).length; i_++) {
            if (first === this.state.cards[i_].j || first === this.state.cards[i_].i
                || second === this.state.cards[i_].j || second === this.state.cards[i_].i) {
                indexToDelete.push(i_);
            }
            if ((this.props.value[first] === this.props.value[this.state.cards[i_].i] && this.props.value[second] === this.props.value[this.state.cards[i_].j]) ||
                (this.props.value[first] === this.props.value[this.state.cards[i_].j] && this.props.value[second] === this.props.value[this.state.cards[i_].i])) {
                indexToDelete.push(i_);
            }
        }
        console.log(indexToDelete);
        if (indexToDelete.length > 0) {
            let cards_temp = {};
            let cont = 0;
            for (let i_ = 0; i_ < Object.keys(this.state.cards).length; i_++) {
                if (indexToDelete.includes(i_) === false) {
                    cards_temp[cont] = this.state.cards[i_];
                    cont++;
                }

            }
            cards_temp[Object.keys(cards_temp).length] = { "i": first, "j": second }
            console.log("sto stampando cards temp ", cards_temp);
            this.setState({ cards: {} })
            this.setState({ cards: cards_temp }, () => { this.props.getCardUser(this.state.cards); })
            //this.getCard(this.state.cards)
        } else {
            this.state.cards[Object.keys(this.state.cards).length] = { "i": first, "j": second }
            //this.setState({ cards: this.state.cards })
            this.setState({ init: false })
            console.log(this.state.cards)
            this.getCard(this.state.cards)
        }


    }
    onClickSolve() {


        let tempDict = {}

        for (let i_ = 0; i_ < Object.keys(this.props.cards_toSolve).length; i_++) {
            tempDict[i_] = { "i": this.props.cards_toSolve[i_][0], "j": this.props.cards_toSolve[i_][1] }
        }
        this.setState({ cards: {} })
        this.setState({ cards: tempDict }, () => { this.props.getCardUser(this.state.cards); })
        this.setState({ init: false });


    }

    onClickErase() {
        this.setState({ cards: {} }, () => { this.props.getCardUser(this.state.cards); })
        this.changeError();
        if (this.props.won) {
            this.setState({ erase: true });
            setTimeout(() => {
                this.setState({ erase: false });
            }, 500);
        }
    }


    getCard(cards) {

        this.props.getCardUser(cards);
    }

    changeError() {

        this.props.changeError();
    }

    setGroup(index) {
        this.changeError();
        this.setState({ init: false })
        let indexToDelete = -1;
        for (let i_ = 0; i_ < Object.keys(this.state.cards).length; i_++) {
            if (index === this.state.cards[i_].j | index === this.state.cards[i_].i) {
                indexToDelete = i_;
                break;
            }
        }

        if (indexToDelete !== -1) {
            let cards_temp = {};
            let cont = 0;
            for (let i_ = 0; i_ < Object.keys(this.state.cards).length; i_++) {
                if (i_ !== indexToDelete) {
                    cards_temp[cont] = this.state.cards[i_];
                    cont++;
                }
            }
            this.setState({ cards: {} })
            this.setState({ cards: cards_temp }, () => { this.props.getCardUser(this.state.cards); })
            //this.state.cards = {}
            //this.state.cards = cards_temp;
            //this.getCard(this.state.cards)
        }

        if (this.state.selectedCell === -1) {
            this.setState({ selectedCell: index })
            //this.state.selectedCell = index;
        } else {
            if (!((index % this.props.size_column === (this.props.size_column - 1) | this.state.selectedCell % this.props.size_column === (this.props.size_column - 1)) &
                (index % this.props.size_column === 0 | this.state.selectedCell % this.props.size_column === 0))) {
                if (Math.abs(index - this.state.selectedCell) === 1 |
                    Math.abs(this.state.selectedCell - index) === this.props.size_column) {

                    this.state.cards[Object.keys(this.state.cards).length] = { "i": this.state.selectedCell, "j": index }
                    this.getCard(this.state.cards)
                }
            }
            this.state.selectedCell = -1;
        }
        // console.log("Cella selezionata: " + this.state.selectedCell);
        // console.log(this.state.cards);
    }

    render() {
        let cont = 0;
        let firstRow = true;
        console.log(this.props.error);
        //console.log(this.state.cards);
        // if (!this.state.init) {
        return (
            <div>

                <section className="game dominosa_2020_container">
                    <h1 className="dominosa_2020_title">
                        Do<span className="header__group-one">mi</span>no<span className="header__group-one">sa</span>

                    </h1>
                    <div className="confetti">
                        <Confetti active={this.props.won} config={config} />
                    </div>
                    {

                        this.props.won ? <h3 className="won">Congratulations</h3> : this.props.error ? <h3 className="error">There are mistakes</h3> :
                            <h3 className="won-transparent">Won</h3>


                    }

                    <table className="game__board dominosa_2020_container">
                        <tbody>
                            {
                                this.props.rows.map((row) => {
                                    if (firstRow === false) {
                                        cont += (this.props.size_column - 1);
                                    }
                                    return (
                                        <tr className="game__row" key={row}>
                                            {
                                                this.props.columns.map((column) => {
                                                    let index = row + cont + column;
                                                    firstRow = false;

                                                    if (index === this.state.selectedCell) {
                                                        return (
                                                            <td className="cell selected  game__cell game__cell--userfilled"
                                                                onClick={() => this.setGroup(index)}>
                                                                {this.props.value[index]}</td>)
                                                    }
                                                    for (let i_ = 0; i_ < Object.keys(this.state.cards).length; i_++) {
                                                        if (index === this.state.cards[i_].j || index === this.state.cards[i_].i) {
                                                            if (index === this.state.cards[i_].j) {
                                                                //Destra
                                                                if (index - this.state.cards[i_].i === -1) {
                                                                    return (
                                                                        <td className="cell  game__cell game__cell--userfilled color-destra"
                                                                            onClick={() => this.setGroup(index)}>
                                                                            {this.props.value[index]}</td>)
                                                                }
                                                                //Sinistra
                                                                if (index - this.state.cards[i_].i === 1) {
                                                                    return (
                                                                        <td className="cell  game__cell game__cell--userfilled color-sinistra"
                                                                            onClick={() => this.setGroup(index)}>
                                                                            {this.props.value[index]}</td>)
                                                                }
                                                                //Giu
                                                                if (index - this.state.cards[i_].i === this.props.size_column) {
                                                                    return (
                                                                        <td className="cell  game__cell game__cell--userfilled color-sopra"
                                                                            onClick={() => this.setGroup(index)}>
                                                                            {this.props.value[index]}</td>)
                                                                }
                                                                //Sopra
                                                                if (index - this.state.cards[i_].i === (-this.props.size_column)) {
                                                                    return (
                                                                        <td className="cell  game__cell game__cell--userfilled color-giu"
                                                                            onClick={() => this.setGroup(index)}>
                                                                            {this.props.value[index]}</td>)
                                                                }
                                                            }

                                                            if (index === this.state.cards[i_].i) {
                                                                //Destra
                                                                if (index - this.state.cards[i_].j === -1) {
                                                                    return (
                                                                        <td className="cell  game__cell game__cell--userfilled color-destra"
                                                                            onClick={() => this.setGroup(index)}>
                                                                            {this.props.value[index]}</td>)
                                                                }
                                                                //Sinistra
                                                                if (index - this.state.cards[i_].j === 1) {
                                                                    return (
                                                                        <td className="cell  game__cell game__cell--userfilled color-sinistra"
                                                                            onClick={() => this.setGroup(index)}>
                                                                            {this.props.value[index]}</td>)
                                                                }
                                                                //Giu
                                                                if (index - this.state.cards[i_].j === this.props.size_column) {
                                                                    return (
                                                                        <td className="cell  game__cell game__cell--userfilled color-sopra"
                                                                            onClick={() => this.setGroup(index)}>
                                                                            {this.props.value[index]}</td>)
                                                                }
                                                                //Sopra
                                                                if (index - this.state.cards[i_].j === (-this.props.size_column)) {
                                                                    return (
                                                                        <td className="cell  game__cell game__cell--userfilled color-giu"
                                                                            onClick={() => this.setGroup(index)}>
                                                                            {this.props.value[index]}</td>)
                                                                }
                                                            }


                                                        }

                                                    }

                                                    return (
                                                        <td className="cell  game__cell game__cell--userfilled"
                                                            onClick={() => this.setGroup(index)}>
                                                            {this.props.value[index]}</td>)

                                                })

                                            }
                                        </tr>
                                    )

                                })
                            }
                        </tbody>
                    </table>
                </section>
                <section className="status position_status">
                    <Timer changed={this.props.changed} won={this.props.won} erase={this.state.erase}></Timer>
                    <div className="status__actions">
                        <Action action='erase' onClickAction={this.onClickErase} />
                        <Action action='hint' onClickAction={this.onClickHint} />
                        <Action action='solve' onClickAction={this.onClickSolve} />
                        <Mode mode='web' onClickMode={this.onClickWebMode} />
                    </div>
                </section>
            </div>
        );
        /* } else {
             return (
                 <div>
                     <section className="game dominosa_2020_container">
                         <h1 className="dominosa_2020_title">DOMINOSA</h1>
                         <table className="game__board dominosa_2020_container">
                             <tbody>
                                 {
                                     this.props.rows.map((row) => {
                                         if (firstRow === false) {
                                             cont += (this.props.size_column - 1);
                                         }
                                         return (
                                             <tr className="game__row" key={row}>
                                                 {
                                                     this.props.columns.map((column) => {
                                                         let index = row + cont + column;
                                                         firstRow = false;
                                                         return (
                                                             <td className="cell  game__cell game__cell--userfilled"
                                                                 onClick={() => this.setGroup(index)}>
                                                                 {this.props.value[index]}</td>)
                                                     })
                                                 }
                                             </tr>
                                         )
 
                                     })
                                 }
                             </tbody>
                         </table>
                     </section>
                     <section className="status position_status">
                         <Timer></Timer>
                         <div className="status__actions">
                             <Action action='erase' onClickAction={this.onClickErase} />
                             <Action action='hint' onClickAction={this.onClickHint} />
                             <Action action='solve' onClickAction={this.onClickSolve} />
                             <Mode mode='mistakes' onClickMode={this.onClickMistakesMode} />
                             <Mode mode='web' onClickMode={this.onClickFastMode} />
 
                         </div>
                     </section>
                 </div>
             );
         }
 
 
     }*/

    }
}