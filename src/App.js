import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      quiz: [],
      correct: "",
      showCorrectAnswer: false,
      showCorrectForOne: true,
      showLastAnswer: "",
      questionCount: 1,
      questionType: "",
      teamOne: "",
      player1Answer: "",
      player1Score: 0,
      teamTwo: "",
      player2Answer: "",
      player2Score: 0,
      numberOfQuestions: 5,
      questionType: 9,
      difficulty: "",
      seconds: 20,
      timerOn: false,
      count: 0,
      isLoading: true,
      gameStart: true,
      gamePlay: false,
      gameFinished: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    const { name, value, type, checked } = event.target;
    type === "checked"
      ? this.setState({ [name]: checked })
      : this.setState({ [name]: value });
  };

  handleSubmit = event => {
    if (
      this.state.player1Answer !== this.state.quiz.results[0].correct_answer &&
      this.state.player2Answer !== this.state.quiz.results[0].correct_answer
    ) {
      this.setState({
        correct: this.state.quiz.results[0].correct_answer,
        showCorrectAnswer: true
      });
      setTimeout(() => {
        this.setState({ showCorrectAnswer: false, seconds: 20 });
      }, 2500);
    }
    if (
      this.state.player1Answer === this.state.quiz.results[0].correct_answer
    ) {
      this.setState(prevState => {
        prevState.player1Score = prevState.player1Score + 1;
      });
    }

    if (
      this.state.player1Answer !== this.state.quiz.results[0].correct_answer ||
      this.state.player2Answer !== this.state.quiz.results[0].correct_answer
    ) {
      this.setState({
        showLastAnswer: this.state.quiz.results[0].correct_answer,
        showCorrectForOne: true
      });
      setTimeout(() => {
        this.setState({ showCorrectForOne: false });
      }, 3500);
    }

    if (
      this.state.player2Answer === this.state.quiz.results[0].correct_answer
    ) {
      this.setState(prevState => {
        prevState.player2Score = prevState.player2Score + 1;
      });
    }

    this.setState(this.state.quiz.results.splice(0, 1));
    setTimeout(() => {}, 3500);

    if (this.state.quiz.results.length === 0) {
      this.setState({
        gameFinished: true,
        gamePlay: false,
        gameStart: false,
        count: 1
      });
    }

    this.setState(prevState => {
      prevState.questionCount = prevState.questionCount + 1;
    });

    this.setState({ seconds: 20 });

    if (event !== "noPrevent") {
      event.preventDefault();
    }
  };

  endOfGame = () => {
    this.setState({
      gamePlay: false,
      reloadData: true,
      gameStart: true,
      quiz: [],
      isLoading: true,
      player1Score: 0,
      player2Score: 0,
      questionCount: 1,
      count: 0
    });
  };

  getData = () => {
    return fetch(
      //
      `https://opentdb.com/api.php?amount=${this.state.numberOfQuestions}&category=${this.state.questionType}&difficulty=${this.state.difficulty}&type=multiple`
    )
      .then(questions => questions.json())
      .then(questions => {
        this.setState({
          quiz: questions,
          isLoading: false,
          gameStart: false,
          gamePlay: true
        });
      })
      .then(() => {
        this.setState({ seconds: 20 });
      });
  };

  timer() {
    this.myInterval = setInterval(() => {
      this.setState(({ seconds }) => ({
        seconds: seconds - 1
      }));
    }, 1000);
  }

  stopTimer() {
    clearTimeout(this.myInterval);
  }

  htmlDecode = input => {
    return input
      .replace(/&amp;/g, "&")
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&shy;/g, "-")
      .replace(/rsquo;/g, '"')
      .replace(/&ouml;/g, "Ö")
      .replace(/&eacute;/g, "é");
  };

  render() {
    if (this.state.seconds === 0 && this.state.gameStart !== true) {
      this.handleSubmit("noPrevent");
    }

    if (this.state.count === 0 && !this.state.gameStart) {
      this.timer();
      this.setState({ count: 1 });
    }

    if (this.state.gameStart) {
      this.stopTimer();
      return (
        <div className="wrapper">
          <div className="welcometitle">
            <h1>THE BIG QUIZ.</h1>
          </div>

          <div className="setupWrapper">
            <div className="teamNames">
              <div className="formLabels">
                <label>Team 1 name:</label>
                <input
                  type="text"
                  value={this.state.teamOne}
                  name="teamOne"
                  placeholder="Team 1 name"
                  onChange={this.handleChange}
                />
              </div>
              <div className="formLabels">
                <label>Team 2 name:</label>
                <input
                  type="text"
                  placeholder={this.state.teamTwo}
                  value={this.state.teamTwo}
                  name="teamTwo"
                  placeholder="Team 2 name"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="questionSetup">
              <div className="formLabels">
                <label>Type of questions:</label>
                <select
                  className="selects"
                  value={this.state.questionType}
                  onChange={this.handleChange}
                  name="questionType"
                >
                  <option value="9">General Knowledge</option>
                  <option value="11">Film</option>
                  <option value="12">Music</option>
                  <option value="23">History</option>
                  <option value="21">Sport</option>
                </select>
              </div>

              <div className="formLabels">
                <label>Number of:</label>
                <select
                  className="selects"
                  value={this.state.numberOfQuestions}
                  onChange={this.handleChange}
                  name="numberOfQuestions"
                >
                  <option value="5">5 (default)</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>

              <div className="formLabels">
                <label>Difficulty:</label>
                <select
                  className="selects"
                  value={this.state.difficulty}
                  onChange={this.handleChange}
                  name="difficulty"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>
          <div className="playGame">
            <button className="playButton" onClick={this.getData}>
              Play Now!
            </button>
          </div>
        </div>
      );
    }

    if (this.state.gamePlay) {
      const insertAnswer = Math.floor(Math.random() * 4);
      const question = this.htmlDecode(this.state.quiz.results[0].question);
      const correct_answer = this.state.quiz.results[0].correct_answer;
      const possibleAnswers = this.state.quiz.results[0].incorrect_answers;
      let revealAnswer = this.state.revealAnswer;

      if (this.state.showCorrectAnswer) {
        return (
          <div className="finishedWrapper">
            <div className="wrongText">
              <h1>BOTH WRONG!</h1>{" "}
              <p>
                The correct answer was {this.htmlDecode(this.state.correct)}
              </p>
            </div>
          </div>
        );
      }

      if (this.state.isLoading) {
        return (
          <div>
            <p>"loading..."</p>
          </div>
        );
      }

      if (possibleAnswers.length !== 4) {
        possibleAnswers.splice(insertAnswer, 0, correct_answer);
      }
      if (this.state.teamOne === "") {
        this.setState({ teamOne: "Team One" });
      }
      if (this.state.teamTwo === "") {
        this.setState({ teamTwo: "Team Two" });
      }
      if (this.state.showCorrectForOne) {
        revealAnswer = `Answer: ${this.state.showLastAnswer}`;
      }

      return (
        <div className="quizWrapper">
          <div className="questionBand">
            <div className="questionText">{`Q${this.state.questionCount}. ${question}`}</div>
            <div className="timerCircle">
              <div className="timer">{`${this.state.seconds}`}</div>
            </div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="answerStrip">{revealAnswer}</div>
            <div className="questionRowSetup">
              <div className="teamSetup">
                <div className="playerOneScore">
                  <div>{this.state.teamOne}</div>
                  <div>Score:{this.state.player1Score}</div>
                </div>
                <div className="teamQuesionsList">
                  {possibleAnswers.map(item => {
                    return (
                      <p>
                        <input
                          type="radio"
                          name="player1Answer"
                          checked={this.state.player1Answer === item}
                          onChange={this.handleChange}
                          value={item}
                        />
                        <label>{this.htmlDecode(item)}</label>
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className="teamSetup">
                <div className="playerTwoScore">
                  <div>{this.state.teamTwo}</div>
                  <div>Score:{this.state.player2Score}</div>
                </div>
                <div className="teamQuesionsList">
                  {possibleAnswers.map(item => {
                    return (
                      <p>
                        <input
                          type="radio"
                          name="player2Answer"
                          checked={this.state.player2Answer === item}
                          onChange={this.handleChange}
                          value={item}
                        />
                        <label>{this.htmlDecode(item)}</label>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="answerBar">
              <input className="answerButton" type="submit" value="Answer" />
            </div>
          </form>
        </div>
      );
    }

    if (this.state.gameFinished) {
      let winner = "";
      this.stopTimer();
      if (this.state.player1Score > this.state.player2Score) {
        winner = `${this.state.teamOne} WINS!!`;
      }
      if (this.state.player2Score > this.state.player1Score) {
        winner = `${this.state.teamTwo} WINS!!`;
      }
      if (this.state.player1Score === this.state.player2Score) {
        winner = `It's a draw!`;
      }
      return (
        <div className="finishedWrapper">
          <div className="finishedTexBox">
            <h1>{winner}</h1>
            Team 1 scored: {this.state.player1Score}
            <br />
            Team 2 scored: {this.state.player2Score}
            <input
              className="finishButton"
              onClick={this.endOfGame}
              type="submit"
              value="Play again?"
            />
          </div>
        </div>
      );
    }
  }
}

export default App;
