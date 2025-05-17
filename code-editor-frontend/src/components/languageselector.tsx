const LanguageSelector = ({ language, setLanguage }:any) => {
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="cpp">C++</option>
      <option value="c">C</option>
      <option value="python">Python</option>
      <option value="javascript">JavaScript</option>
      <option value="java">Java</option>
    </select>
  );
};

export default LanguageSelector;
