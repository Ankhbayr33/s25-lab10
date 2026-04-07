import React, { useState } from 'react';
import './Quiz.css';
import QuizCore from '../core/QuizCore';
import QuizQuestion from '../core/QuizQuestion';

const quizCore = new QuizCore();

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    quizCore.getCurrentQuestion()
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);

  const handleOptionSelect = (option: string): void => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = (): void => {
    if (!selectedAnswer || !currentQuestion) return;

    quizCore.answerQuestion(selectedAnswer);

    if (quizCore.hasNextQuestion()) {
      quizCore.nextQuestion();
      setCurrentQuestion(quizCore.getCurrentQuestion());
      setSelectedAnswer(null);
      setQuestionNumber((prev) => prev + 1);
    }
  };

  const handleSubmit = (): void => {
    if (!selectedAnswer || !currentQuestion) return;

    quizCore.answerQuestion(selectedAnswer);
    setScore(quizCore.getScore());
    setIsFinished(true);
    setCurrentQuestion(null);
  };

  if (isFinished) {
    return (
      <div className="quiz-container">
        <div className="result-card">
          <h2>Quiz дууслаа</h2>
          <p className="score-text">
            Таны оноо: {score} / {quizCore.getTotalQuestions()}
          </p>
          <p className="result-message">
            {score === quizCore.getTotalQuestions()
              ? 'Маш сайн! Бүх асуултад зөв хариуллаа.'
              : (score ?? 0) >= quizCore.getTotalQuestions() / 2
              ? 'Сайн байна. Та ихэнхийг нь зөв хариулжээ.'
              : 'Дахин оролдоод үзээрэй.'}
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="quiz-container">
        <h2>Асуулт олдсонгүй</h2>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <h1 className="quiz-title">Танин мэдэхүйн Quiz</h1>

        <div className="quiz-header">
          <span className="question-count">
            Асуулт {questionNumber} / {quizCore.getTotalQuestions()}
          </span>
        </div>

        <h2 className="question-text">{currentQuestion.question}</h2>

        <ul className="options-list">
          {currentQuestion.options.map((option: string) => (
            <li
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={selectedAnswer === option ? 'option selected' : 'option'}
            >
              {option}
            </li>
          ))}
        </ul>

        <div className="button-group">
          {quizCore.hasNextQuestion() ? (
            <button onClick={handleNextQuestion} disabled={!selectedAnswer}>
              Дараагийн асуулт
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!selectedAnswer}>
              Дуусгах
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;