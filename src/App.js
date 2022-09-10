import React from 'react'
import {nanoid} from 'nanoid'

import './style.css'
import Question from './Question'


export default function App() {
    const [questions, setQuestions] = React.useState([])
    const [score, setScore] = React.useState(0)
    const [mark, setMark] = React.useState(false)
    const [startGame, setStartGame] = React.useState(false)
    
    
 
 
    function launch() {
        setStartGame(true)
    }
 
    React.useEffect(() => {
        fetchQuestions()
    }, [])
    
    function fetchQuestions() {
        fetch('https://opentdb.com/api.php?amount=5&encode=base64')
            .then(res => res.json())
            .then(data => {
                setQuestions(data.results.map((item) => ({
                    ...item,
                    correct_answer: {
                        answer: item.correct_answer,
                        id: nanoid(),
                        isSelected: false
                    },
                    allAnswers: shuffle([
                        ...item.incorrect_answers.map(item => ({
                            answer: item,
                            id: nanoid(),
                            isSelected: false
                        })),
                        
                        {
                            answer: item.correct_answer,
                            id: nanoid(),
                            isSelected: false
                        }
                    ])
                })))
            })
    }
    
    console.log(questions)
    
    function checkSelected(id, question) {
        setQuestions(prevQuestions => prevQuestions.map(item => {
            if (item.question === question) {
                return {
                    ...item,
                    id: nanoid(),
                    allAnswers: item.allAnswers.map(item => {
                        return item.id === id ? {
                            ...item,
                            isSelected: true
                        } : {
                            ...item,
                            isSelected: false
                        }
                    }),
                }
            } else {
                return item
            }
        }))
    }
    
    
    function checkAnswers() {
            if(!mark) {
                setMark(true)
                for(const question of questions) {
                  for(let i = 0; i < question.allAnswers.length; i++) {
                    if (question.allAnswers[i].isSelected === true && question.correct_answer.answer === question.allAnswers[i].answer) {
                        setScore(prevScore => prevScore + 1)
                    } else {
                        setScore(prevScore => prevScore)
                    }

                  }
    
                }
            } else {
                setMark(false)
                fetchQuestions()
                setScore(0)
            }
    
    }
    
    function shuffle(array) {
            let currentIndex = array.length,  randomIndex;

            // While there remain elements to shuffle.
            while (currentIndex != 0) {

                // Pick a remaining element.
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
            }

            return array;
        }
    
    
    const questionElements = questions.map(question => 
             <Question
                key={question.question} 
                question={question.question}
                correct_answer={question.correct_answer}
                allAnswers={question.allAnswers}
                checkSelected={checkSelected}
                renderCorrectAnswer={score.correct_answer}
                mark={mark}
            /> 
            

    )
    
    return !startGame ? (
        <main className='start--game'>
            <div className='quizzical--box'>
                <h1  className='quizzical'>Quizzical</h1>
                <p className='quizzical--description'>Answer randomly selected questions and see how you well you perform ;)</p>
                <button className='quizzical--btn' onClick={launch}>Start Game</button>
            </div>
        </main>
    ) : (
        <main className='main'>
            <div className="main-box">
              <div className='questions'>
                  {questionElements}
              </div>
            <div className='check--answers'>
                  {mark && <h3 className='score'>You scored {score}/5 correct answers</h3>}
                  <button className='check--answers_btn' onClick={checkAnswers}>{!mark ? 'Check Answers' : 'Play Again'}</button>
            </div>
            </div>
        </main>
    )
}

