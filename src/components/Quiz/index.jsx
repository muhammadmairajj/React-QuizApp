import React, { useEffect, useState } from "react";
import { resultInitialState } from "../../constant/questions";
import AnswerTimer from "../AnswerTimer";
import "./style.css";

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIndex, setAnswerIndex] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [higherScores, setHigherScores] = useState([]);
  const [showScores, setShowScores] = useState(false);
  //   const [selectedMcqsAnswer, setSelectedMcqsAnswer] = useState(
  //     Array(questions.length).fill(null)
  //   );

  const { question, type, correctAnswer, choices } = questions[currentQuestion];

  // onClick Answer
  const onClickAnswer = (answer, index) => {
    setAnswerIndex(index);
    // setSelectedMcqsAnswer((prevSelected) => {
    //   const updatedSelected = [...prevSelected];
    //   updatedSelected[currentQuestion] = answer;
    //   return updatedSelected;
    // });
    if (answer === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };
  //   console.log("selected MCQS ANSWER ---> ", selectedMcqsAnswer);

  // Next Click Button
  const onClickNext = (finalAnswer) => {
    setAnswerIndex(null);
    setShowAnswerTimer(false);
    setInputValue("");
    setResult((prev) =>
      finalAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );

    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentQuestion(0);
      setShowResult(true);
    }

    setTimeout(() => {
      setShowAnswerTimer(true);
    });
  };

  const handleBackButton = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion((prev) => prev - 1);
      //   setSelectedMcqsAnswer((prevSelected) => {
      //     const updatedSelected = [...prevSelected];
      //     updatedSelected[currentQuestion - 1] = correctAnswer;
      //     return updatedSelected;
      //   });
    }
  };

  const onTryAgain = () => {
    setResult(resultInitialState);
    setShowResult(false);
  };

  const handleTimeUp = () => {
    setAnswer(false);
    onClickNext(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);

    if (event.target.value === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const showAnswerUI = () => {
    if (type === "FIB") {
      return (
        <input type="text" value={inputValue} onChange={handleInputChange} />
      );
    }
    return (
      <ul>
        {choices.map((choice, index) => {
          //   console.log("choice --> ", choice);
          return (
            <li
              key={choice}
              onClick={() => onClickAnswer(choice, index)}
              //   className={
              //     answerIndex === index ||
              //     selectedMcqsAnswer[currentQuestion - 1] === choice
              //       ? "selected-answer"
              //       : null
              //   }
              className={answerIndex === index ? "selected-answer" : null}
            >
              {choice}
            </li>
          );
        })}
      </ul>
    );
  };

  const handleSave = () => {
    const score = {
      name,
      score: result.score,
    };

    const newHighScores = [...higherScores, score].sort(
      (a, b) => b.score - a.score
    );
    setHigherScores(newHighScores);
    setShowScores(true);
    localStorage.setItem("highScores", JSON.stringify(newHighScores));
  };

  useEffect(() => {
    const storedHighScores = localStorage.getItem("highScores");

    if (storedHighScores) {
      try {
        setHigherScores(JSON.parse(storedHighScores));
      } catch (error) {
        console.error("Error parsing stored high scores:", error);
      }
    }
  }, []);

  const handleTryAgain = () => {
    setShowScores(false);
    setHigherScores([]);
    onTryAgain();
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-heading">QUIZ APP</h1>
      {!showResult ? (
        <>
          {showAnswerTimer && (
            <AnswerTimer duration={5} timeUp={handleTimeUp} />
          )}

          <span className="active-question-no">{currentQuestion + 1}</span>
          <span className="total-questions">/{questions.length}</span>
          <h2>{question}</h2>
          {/* {showAnswerUI(selectedMcqsAnswer[currentQuestion])} */}
          {showAnswerUI()}

          <div className="footer">
            <button
              onClick={handleBackButton}
              className="back_btn"
              disabled={answerIndex === null && !inputValue}
            >
              Back
            </button>
            <button
              onClick={() => onClickNext(answer)}
              disabled={answerIndex === null && !inputValue}
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div className="result">
          <h3>Result</h3>
          <p>
            Total Questions: <span>{questions.length}</span>
          </p>
          <p>
            Score: <span>{result.score}</span>
          </p>
          <p>
            CorrectAnswers: <span>{result.correctAnswers}</span>
          </p>
          <p>
            WrongAnswers: <span>{result.wrongAnswers}</span>
          </p>
          <button onClick={handleTryAgain} className="try-again-btn">
            Try Again
          </button>
          <br />
          <br />
          {!showScores ? (
            <>
              <h3>
                Enter Your Name below <br /> to save your score!{" "}
              </h3>
              <input
                type="text"
                placeholder="Enter Your Name: "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={handleSave} className="save_btn">
                Save
              </button>
            </>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {higherScores.map((val, index) => {
                  console.log("val --> ", val);
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{val.name}</td>
                      <td>{val.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
