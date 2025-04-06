import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 导入 useParams 和 useNavigate 钩子
import './ProblemDetail.css'; // 导入样式文件
import { useSelector } from 'react-redux';
import { Feedback, fetchFeedback, refreshFeedback } from '../APIs/feedbackAPI';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';

// 定义问题数据结构
interface Problem {
  problem_id: number;
  description: string;
  choice1: string;
  choice2: string;
  choice3: string | null;
  correct_answer: number;
}

const ProblemDetail: React.FC = () => {
  const { pid } = useParams<{ pid: string }>();
  const numericPid = pid ? parseInt(pid, 10) : NaN;
  const [problem, setProblem] = useState<Problem | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null); // 确保选项是数字类型
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [loading, setLoading] = useState<boolean>(false);

  const student_id = currentUser?.user_id;

  const navigate = useNavigate(); // 使用 useNavigate 钩子

  useEffect(() => {
    if (isNaN(numericPid)) return;

    const fetchProblem = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/problems/${numericPid}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch problem data');
        }
        const data = await response.json();
        setProblem({
          problem_id: data.problem_id,
          description: data.description,
          choice1: data.choice1,
          choice2: data.choice2,
          choice3: data.choice3,
          correct_answer: data.correct_answer,
        });
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    fetchProblem();
  }, [numericPid]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 选项值应该是数字
    setSelectedOption(parseInt(event.target.value, 10));
  };

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert('Please select an option');
      return;
    }

    if (!student_id) {
      alert('Student ID not found.');
      return;
    }

    try {
      // 发送请求到后端创建 submission
      const response = await fetch('http://127.0.0.1:8000/api/submissions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: numericPid, // 问题ID
          student: student_id, // 学生ID
          submitted_answer: selectedOption, // 提交的答案（数字类型）
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const submission = await response.json();
      // 根据 result 字段判断答案是否正确
      if (submission.result === 'T') {
        setResultMessage('Correct!');
      } else {
        setResultMessage('Error');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setResultMessage('Error occurred while submitting.');
    }
  };

  const handleFeedback = async (refresh: boolean) => {
    if (!student_id) {
      setErrorMessage('Student ID not found.');
      return;
    }

    if (isNaN(numericPid)) {
      setErrorMessage('Problem ID not found.');
      return;
    }

    try {
      setLoading(true);
      const fetchedFeedback = refresh
        ? await refreshFeedback(student_id, numericPid)
        : await fetchFeedback(student_id, numericPid);

      if ('feedback_id' in fetchedFeedback) {
        setFeedback(fetchedFeedback);
        setErrorMessage(null);
      } else if ('message' in fetchedFeedback) {
        setErrorMessage(fetchedFeedback.message);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setErrorMessage('An error occurred while fetching feedback.');
    } finally {
      setLoading(false);
    }
    setShowFeedback(true);
  };

  const handleGoBack = () => {
    navigate('/QueryQuest/Problem'); // 使用 navigate() 导航回问题列表页面
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="problem-detail">
      <h2>Problem Detail</h2>
      <div>
        <p>{problem.description}</p>
        <form>
          {problem.choice1 && (
            <div>
              <label>
                <input
                  type="radio"
                  value="1" // 选项 1
                  checked={selectedOption === 1}
                  onChange={handleOptionChange}
                />
                {problem.choice1}
              </label>
            </div>
          )}
          {problem.choice2 && (
            <div>
              <label>
                <input
                  type="radio"
                  value="2" // 选项 2
                  checked={selectedOption === 2}
                  onChange={handleOptionChange}
                />
                {problem.choice2}
              </label>
            </div>
          )}
          {problem.choice3 && (
            <div>
              <label>
                <input
                  type="radio"
                  value="3" // 选项 3
                  checked={selectedOption === 3}
                  onChange={handleOptionChange}
                />
                {problem.choice3}
              </label>
            </div>
          )}
        </form>
      </div>
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
      <button className="feedback-btn" onClick={() => handleFeedback(false)}>
        Feedback
      </button>

      {resultMessage && (
        <p
          className={`result-message ${resultMessage === 'Correct!' ? 'correct' : 'error'}`}
        >
          {resultMessage}
        </p>
      )}
      {showFeedback && feedback && (
        <div
          style={{
            marginTop: '10px',
            position: 'relative',
            padding: '35px',
            minHeight: '10px',
          }}
        >
          <div
            className="feedback"
            dangerouslySetInnerHTML={{
              __html: feedback.f_content.replace(/\n/g, '<br>'),
            }}
          ></div>

          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.3s ease-in-out',
                zIndex: 10,
              }}
            >
              <CircularProgress style={{ color: 'white' }} />
            </div>
          )}

          <Tooltip title="Refresh Feedback" arrow>
            <IconButton
              onClick={() => handleFeedback(true)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
              }}
              aria-label="refresh feedback"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Go Back Button */}
      <button className="go-back-btn" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default ProblemDetail;