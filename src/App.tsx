import { MdTreeNodeView } from "./components/MdTreeNodeView.jsx";
import type { MdTreeNode } from "./types";
import "./App.css";
import initialDocMdStr from "./initial-doc.md?raw";

const App = () => {
  const node: MdTreeNode = {
    content: initialDocMdStr,
    children: [],
  };

  return (
    <div className="App">
      <MdTreeNodeView node={node} isRoot />
    </div>
  );
};

export default App;
