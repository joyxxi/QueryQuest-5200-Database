export default function Problem() {
  return (
    <div id="wd-problem-screen">
      <h2>Problem</h2>
      <button id="wd-add-problem">+ Problem</button>
      <div>
        <ol id="wd-problems">
          <li className="wd-problem">
            <div className="wd-title">Problem 1</div>
          </li>
          <li className="wd-problem">
            <div className="wd-title">Problem 2</div>
          </li>
          <li className="wd-problem">
            <div className="wd-title">Problem 3</div>
          </li>
        </ol>
      </div>
    </div>
  );
}
