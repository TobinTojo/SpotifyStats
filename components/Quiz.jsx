import React, { useState, useEffect } from "react";

const Quiz = ({
  accessToken,
  topTracks,
  topTracksSecondSet,
  topTracksThirdSet,
  topTracksFourthSet,
  topTracksFifthSet,
  topTracksSixMonths,
  topTracksSixMonthsSecondSet,
  topTracksSixMonthsThirdSet,
  topTracksSixMonthsFourthSet,
  topTracksSixMonthsFifthSet,
  topTracksYear,
  topTracksYearSecondSet,
  topTracksYearThirdSet,
  topTracksYearFourthSet,
  topTracksYearFifthSet,
  fetchTopArtists,
  DEBUG_DISABLE_COOLDOWN,
  onQuizComplete,
  totalScore,
  quizHistory,
  onClose
}) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [cooldownMessage, setCooldownMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const generateQuizQuestions = async () => {
    try {
      const getAllTracksWithRanks = (timeRange) => {
        let tracks = [];
        switch (timeRange) {
          case "short_term":
            tracks = [
              ...topTracks,
              ...topTracksSecondSet,
              ...topTracksThirdSet,
              ...topTracksFourthSet,
              ...topTracksFifthSet,
            ];
            break;
          case "medium_term":
            tracks = [
              ...topTracksSixMonths,
              ...topTracksSixMonthsSecondSet,
              ...topTracksSixMonthsThirdSet,
              ...topTracksSixMonthsFourthSet,
              ...topTracksSixMonthsFifthSet,
            ];
            break;
          case "long_term":
            tracks = [
              ...topTracksYear,
              ...topTracksYearSecondSet,
              ...topTracksYearThirdSet,
              ...topTracksYearFourthSet,
              ...topTracksYearFifthSet,
            ];
            break;
          default:
            tracks = [];
        }
        return tracks.map((track, index) => ({ ...track, rank: index + 1 }));
      };
  
      const getAllArtistsWithRanks = async (timeRange) => {
        try {
          const [firstSet, secondSet] = await Promise.all([
            fetchTopArtists(timeRange, 0),
            fetchTopArtists(timeRange, 50),
          ]);
          return [...firstSet, ...secondSet].map((artist, index) => ({
            ...artist,
            rank: index + 1,
          }));
        } catch (error) {
          console.error(`Failed to fetch artists for ${timeRange}:`, error);
          return [];
        }
      };
  
      const getRankRange = (rank) => {
        if (rank <= 10) return "Top 10";
        if (rank <= 25) return "11-25";
        if (rank <= 50) return "26-50";
        if (rank <= 100) return "51-100";
        if (rank <= 250) return "101-250";
        return "Not in Top 250";
      };
  
      const generateOptions = (correctRange) => {
        const possibleRanges = [
          "Top 10",
          "11-25",
          "26-50",
          "51-100",
          "101-250",
          "Not in Top 250",
        ];
        const incorrectRanges = possibleRanges.filter(
          (range) => range !== correctRange
        );
        const shuffledIncorrect = incorrectRanges
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        return [...shuffledIncorrect, correctRange].sort(() => 0.5 - Math.random());
      };
  
      const timeRanges = [
        { id: "short_term", label: "4 weeks" },
        { id: "medium_term", label: "6 months" },
        { id: "long_term", label: "1 year" },
      ];
  
      const questions = [];
  
      // Track questions
      for (const { id, label } of timeRanges) {
        const tracks = await getAllTracksWithRanks(id);
        tracks.forEach((track) => {
          const correctRange = getRankRange(track.rank);
          questions.push({
            type: "trackRank",
            question: `In the last ${label}, where does the song <strong style="color: #27adf5;">${track.name}</strong> place?`,
            correctAnswer: correctRange,
            options: generateOptions(correctRange),
            imageUrl: track.album.images[0]?.url, // Add image URL for the track
          });
        });
      }
  
      // Artist questions
      for (const { id, label } of timeRanges) {
        const artists = await getAllArtistsWithRanks(id);
        artists.forEach((artist) => {
          const correctRange = getRankRange(artist.rank);
          questions.push({
            type: "artistRank",
            question: `In the last ${label}, where does the artist <strong style="color: #27adf5;">${artist.name}</strong> place?`,
            correctAnswer: correctRange,
            options: generateOptions(correctRange),
            imageUrl: artist.images[0]?.url, // Add image URL for the artist
          });
        });
      }
  
      const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
      setQuizQuestions(shuffledQuestions.slice(0, 10));
    } catch (error) {
      console.error("Failed to generate quiz questions:", error);
      setQuizQuestions([]);
    }
  };
  

  const startQuiz = async () => {
    setIsLoading(true);
    await generateQuizQuestions();
    setIsLoading(false);

    if (quizQuestions.length > 0) {
      setCurrentQuestionIndex(0);
      setQuizScore(0);
      setShowQuizResult(false);
      setIsQuizActive(true);
      setTimeLeft(30);
    }
  };

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      if (timeLeft > 0 && !isAnswerSubmitted) {
        setTimeLeft(prev => prev - 1);
      } else if (timeLeft === 0 && !isAnswerSubmitted) {
        handleAnswerSubmit();
      }
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [timeLeft, isQuizActive, isAnswerSubmitted]);

  const handleAnswerSubmit = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    const newScore = isCorrect ? quizScore + 1 : quizScore;

    setIsAnswerSubmitted(true);
    setShowAnswer(true);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setQuizScore(newScore);
        setShowAnswer(false);
        setUserAnswer("");
        setTimeLeft(30);
        setIsAnswerSubmitted(false);
      }, 1500); // Delay of 1.5 seconds before next question
    } else {
      setTimeout(() => {
        setQuizScore(newScore);
        const percentage = (newScore / quizQuestions.length) * 100;
        const pointsEarned = Math.round(percentage);

        onQuizComplete({
          score: newScore,
          total: quizQuestions.length,
          points: pointsEarned,
          date: new Date().toISOString()
        });

        setShowQuizResult(true);
      }, 1500); // Delay of 1.5 seconds before showing results
    }
  };

  const renderAnswerFeedback = (option) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (isAnswerSubmitted) {
      return option === currentQuestion.correctAnswer
        ? "correct"
        : option === userAnswer
        ? "incorrect"
        : "";
    }
    return "";
  };

  useEffect(() => {
    const checkCooldown = () => {
      if (DEBUG_DISABLE_COOLDOWN) {
        startQuiz();
        return;
      }

      const now = new Date();
      const next12AM = new Date(now);
      next12AM.setHours(24, 0, 0, 0);
      const estOffset = -5 * 60 * 60 * 1000;
      const next12AMEST = new Date(next12AM.getTime() + estOffset);

      const lastQuizAttempt = localStorage.getItem("lastQuizAttempt");
      if (lastQuizAttempt) {
        const timeSinceLastAttempt = now.getTime() - parseInt(lastQuizAttempt, 10);
        if (timeSinceLastAttempt < 0 || now < next12AMEST) {
          const remainingTime = next12AMEST.getTime() - now.getTime();
          const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
          const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
          setCooldownMessage(`You can only play the quiz once per day. Please try again at 12 AM EST.`);
          return;
        }
      }
      localStorage.setItem("lastQuizAttempt", now.getTime().toString());
      startQuiz();
    };

    checkCooldown();
  }, []);

  return (
    <div className="quiz-container">
      <h1>Quiz of the Day</h1>
      {cooldownMessage ? (
        <div className="cooldown-message">
          <p>{cooldownMessage}</p>
          <button onClick={onClose} id="back-btn">
            Back to Top Stats
          </button>
        </div>
      ) : isLoading ? (
        <div className="quiz-loading">
          <div className="spinner"></div>
          <p>Generating personalized questions...</p>
        </div>
      ) : (
        <>
          {quizQuestions.length > 0 && (
            <>
              {showQuizResult ? (
                <div className="quiz-result">
                  <h2>Quiz Completed!</h2>
                  <p>Your score: {quizScore} / {quizQuestions.length}</p>
                  <p>Points earned: +{Math.round((quizScore / quizQuestions.length) * 100)}</p>
                  <button onClick={onClose} id="back-btn">
                    Back to Top Stats
                  </button>
                </div>
              ) : (
                <>
                  <div className="quiz-progress">
                    <div className="quiz-progress-bar" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}>
                      <span className="quiz-progress-text">
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                      </span>
                    </div>
                  </div>
                  <div className="quiz-question">
                    {quizQuestions[currentQuestionIndex].imageUrl && (
                      <img
                        src={quizQuestions[currentQuestionIndex].imageUrl}
                        alt="Track or Artist"
                        className="quiz-image"
                      />
                    )}
                    <p dangerouslySetInnerHTML={{ __html: quizQuestions[currentQuestionIndex].question }} />
                  </div>
                  <div className="quiz-options">
                    {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(option)}
                        className={`${renderAnswerFeedback(option)} ${userAnswer === option ? "selected" : ""}`}
                        disabled={isAnswerSubmitted}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="timer-ring">
                    <svg width="100" height="100">
                      <circle className="timer-ring-base" cx="50" cy="50" r="45" />
                      <circle
                        className="timer-ring-progress"
                        cx="50"
                        cy="50"
                        r="45"
                        style={{
                          strokeDasharray: 2 * Math.PI * 45,
                          strokeDashoffset: (timeLeft / 30) * (2 * Math.PI * 45),
                        }}
                      />
                      <text x="50" y="50" className="timer-text">{timeLeft}s</text>
                    </svg>
                  </div>
                  <button
                    onClick={handleAnswerSubmit}
                    id="next-button"
                    disabled={!userAnswer || isAnswerSubmitted}
                  >
                    {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
