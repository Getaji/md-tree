import { useState } from "react";
import { MdTreeNodeView } from "./components/MdTreeNodeView.jsx";
import type { MdTreeNode } from "./types";
import "./App.css";
import initialDocMdStr from "./initial-doc.md?raw";

const App = () => {
  const [node, setNode] = useState<MdTreeNode>({
    content: initialDocMdStr,
    children: [],
  });

  const onChangeNode = (newNode: MdTreeNode) => {
    setNode(newNode);
  };

  return (
    <div className="app">
      <MdTreeNodeView node={node} isRoot onChangeNode={onChangeNode} />
    </div>
  );
};

export default App;
