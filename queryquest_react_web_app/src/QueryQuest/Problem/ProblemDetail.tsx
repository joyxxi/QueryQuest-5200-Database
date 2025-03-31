import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 导入 useParams 钩子
import "./ProblemDetail.css"; // 导入样式文件

// 模拟的题目数据，可以从后端获取数据后填充
interface Problem {
  id: number;
  content: string;
  options: string[];
  correctAnswer: string; // 这个是正确的答案，例如 'A'
}

const ProblemDetail: React.FC = () => {
  const { id } = useParams(); // 从 URL 中获取问题的 ID
  const [problem, setProblem] = useState<Problem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // 假设从API获取数据
  useEffect(() => {
    // 根据 ID 获取问题数据。此处模拟为静态数据，实际中可以通过 API 请求
    const fetchProblem = async () => {
      // 使用 `id` 从 API 获取数据
      // 例如：const response = await fetch(`/api/problems/${id}`);
      // const data = await response.json();

      // 模拟根据 ID 获取数据
      const problemData: Problem = {
        id: Number(id), // 将 URL 中的 `id` 转换为数字
        content: `What is 2 + 2?`,
        options: ["A: 3", "B: 4", "C: 5"],
        correctAnswer: "B", // 正确答案为 B
      };

      setProblem(problemData); // 设置问题数据
    };

    if (id) {
      fetchProblem();
    }
  }, [id]); // 当 ID 改变时，重新获取数据

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an option");
      return;
    }
    if (selectedOption === problem?.correctAnswer) {
      setResultMessage("Correct!");
    } else {
      setResultMessage("Error");
    }
  };

  const handleFeedback = () => {
    setShowFeedback(true);
  };

  if (!problem) {
    return <div>Loading...</div>; // 如果问题数据尚未加载，显示加载提示
  }

  return (
    <div className="problem-detail">
      <h2>Problem Detail</h2>
      <div>
        <p>{problem.content}</p>
        <form>
          {problem.options.map((option, index) => (
            <div key={index}>
              <label>
                <input
                  type="radio"
                  value={`ABC`[index]}
                  checked={selectedOption === `ABC`[index]}
                  onChange={handleOptionChange}
                />
                {option}
              </label>
            </div>
          ))}
        </form>
      </div>
      <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      <button className="feedback-btn" onClick={handleFeedback}>Feedback</button>

      {resultMessage && <p className={`result-message ${resultMessage === "Correct!" ? "correct" : "error"}`}>{resultMessage}</p>}
      {showFeedback && <p className="feedback">This is feedback for the problem.</p>}
    </div>
  );
};

export default ProblemDetail;
