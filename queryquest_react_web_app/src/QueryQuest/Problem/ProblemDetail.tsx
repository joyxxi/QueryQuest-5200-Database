import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 导入 useParams 钩子
import "./ProblemDetail.css"; // 导入样式文件

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
  // 从 URL 中获取 pid，确保它是数字类型
  const { pid } = useParams<{ pid: string }>();
  const numericPid = pid ? parseInt(pid, 10) : NaN; // 确保 pid 转换为数字，如果 pid 不存在则设置为 NaN

  const [problem, setProblem] = useState<Problem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // 获取问题数据
  useEffect(() => {
    if (isNaN(numericPid)) return; // 如果 numericPid 不是有效数字，则不执行 fetch

    const fetchProblem = async () => {
      try {
        // 使用绝对 URL，确保请求到后端的 8000 端口
        const response = await fetch(`http://127.0.0.1:8000/problems/${numericPid}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch problem data");
        }
        const data = await response.json();
        console.log("Problem data:", data); // 确认 API 返回的数据格式
        setProblem({
          problem_id: data.problem_id,
          description: data.description,
          choice1: data.choice1,
          choice2: data.choice2,
          choice3: data.choice3,
          correct_answer: data.correct_answer,
        });
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, [numericPid]); // 依赖 numericPid，确保 ID 改变时重新加载数据

  // 处理选项变化
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  // 提交答案
  const handleSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an option");
      return;
    }
    if (parseInt(selectedOption) === problem?.correct_answer) {
      setResultMessage("Correct!");
    } else {
      setResultMessage("Error");
    }
  };

  // 显示反馈
  const handleFeedback = () => {
    setShowFeedback(true);
  };

  // 如果问题还没有加载完成，显示 "Loading..."
  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="problem-detail">
      <h2>Problem Detail</h2>
      <div>
        <p>{problem.description}</p>
        <form>
          {/* 渲染选项 */}
          {problem.choice1 && (
            <div>
              <label>
                <input
                  type="radio"
                  value="1" // 选项 1
                  checked={selectedOption === "1"}
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
                  checked={selectedOption === "2"}
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
                  checked={selectedOption === "3"}
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
      <button className="feedback-btn" onClick={handleFeedback}>
        Feedback
      </button>

      {resultMessage && (
        <p
          className={`result-message ${
            resultMessage === "Correct!" ? "correct" : "error"
          }`}
        >
          {resultMessage}
        </p>
      )}
      {showFeedback && (
        <p className="feedback">This is feedback for the problem.</p>
      )}
    </div>
  );
};

export default ProblemDetail;

