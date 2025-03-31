import React from "react";
import { Link } from "react-router-dom";

export default function Problem() {
  return (
    <div id="wd-problem-screen">
      <h2>Problem</h2>
      <button id="wd-add-problem">+ Problem</button>
      <div>
        <ol id="wd-problems">
          {/* 使用 Link 组件为每个问题添加跳转链接 */}
          <li className="wd-problem">
            <Link to="/QueryQuest/Problem/1">
              <div className="wd-title">Problem 1</div>
            </Link>
          </li>
          <li className="wd-problem">
            <Link to="/QueryQuest/Problem/2">
              <div className="wd-title">Problem 2</div>
            </Link>
          </li>
          <li className="wd-problem">
            <Link to="/QueryQuest/Problem/3">
              <div className="wd-title">Problem 3</div>
            </Link>
          </li>
        </ol>
      </div>
    </div>
  );
}