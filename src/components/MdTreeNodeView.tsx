import { Fragment, useState, useEffect } from "react";
import produce from "immer";

import { toHTML as markdownToHTML } from "@/markdown";
import "./MdTreeNodeView.css";

import type { MdTreeNode } from "@/types";

type Props = {
  node: MdTreeNode;
  isRoot?: boolean;
  onChangeNode?: (node: MdTreeNode) => void;
  onDeleteNode?: () => void;
};

export const MdTreeNodeView = ({
  node: origNode,
  isRoot = false,
  onChangeNode: nodeChangeHandler,
  onDeleteNode: nodeDeleteHandler,
}: Props) => {
  const [node, setNode] = useState<MdTreeNode>({ ...origNode });
  const [isEditing, setEditing] = useState(false);
  const [editingContent, setEditingContent] = useState("");
  const [contentHTML, setContentHTML] = useState("");

  useEffect(() => {
    (async () => {
      const html = await markdownToHTML(node.content);

      setContentHTML(html);
    })();
  });

  const onClickOK = () => {
    node.content = editingContent;
    setEditing(false);
  };
  const onClickCancel = () => {
    setEditing(false);
    setEditingContent("");
  };
  const onClickEdit = () => {
    setEditingContent(node.content);
    setEditing(true);
  };
  const onClickDelete = () => {
    if (confirm("Do you really want to delete this?")) {
      if (!isRoot) nodeDeleteHandler?.();
    }
  };
  const onChangeNode = (node: MdTreeNode, i: number) => {
    const newNode = produce(node, (draft) => {
      draft.children[i] = node;
    })
    setNode(newNode);
    nodeChangeHandler?.(newNode);
  };
  const onDeleteNode = (_: MdTreeNode, i: number) => {
    const newNode = produce(node, (draft) => {
      draft.children.splice(i, 1);
    })
    setNode(newNode);
    nodeChangeHandler?.(newNode);
  };
  const onClickAddChildren = () => {
    const newNode = produce(node, (draft) => {
      draft.children.push({
        content: "",
        children: [],
      });
    })
    setNode(newNode);
    nodeChangeHandler?.(newNode);
  };
  const onClickImport = (mode = "add") => {
    const json = prompt("json input here");
    if (!json) return;

    try {
      const newNode = JSON.parse(json);
      if (typeof newNode.content !== "string") {
        throw new Error("node.content is not string");
      }
      if (!Array.isArray(newNode.children)) {
        throw new Error("node.children is not array");
      }
      switch (mode) {
        case "overwrite":
          if (confirm("Do you really want to overwrite this?")) {
            node.content = newNode.content;
            node.children = newNode.children;
          }
          break;
        case "add":
        default:
          node.children.push(newNode);
      }
    } catch (e) {
      alert("invalid json input");
      console.error(e);
    }
  };
  const onClickExport = () => {
    const json = JSON.stringify(node);
    prompt("JSON", json);
  };

  return (
    <article className="mdTree-node">
      {isEditing ? (
        <textarea className="mdTree-contentEditor" value={editingContent} />
      ) : (
        <section
          className="mdTree-nodeContent"
          dangerouslySetInnerHTML={{ __html: contentHTML }}
        />
      )}

      <section className="mdTree-nodeMenu">
        {isEditing ? (
          <Fragment>
            <button className="emoji" onClick={onClickOK}>
              ✔️OK
            </button>
            <button className="emoji" onClick={onClickCancel}>
              ❌Cancel
            </button>
          </Fragment>
        ) : (
          <button className="emoji" onClick={onClickEdit}>
            ✒️Edit
          </button>
        )}

        {!isRoot && (
          <button className="emoji" onClick={onClickDelete}>
            🗑️Delete
          </button>
        )}
      </section>
      <section className="mdTree-nodeChildren">
        {node.children.map((child, i) => (
          <MdTreeNodeView
            node={child}
            key={i}
            onChangeNode={onChangeNode.bind(null, child, i)}
            onDeleteNode={onDeleteNode.bind(null, child, i)}
          />
        ))}
        <button
          className="mdTree-addChildren emoji"
          onClick={onClickAddChildren}
        >
          ➕Add Child
        </button>
        <button
          className="mdTree-import emoji"
          onClick={onClickImport.bind(null, "overwrite")}
        >
          📩Import(Overwrite)
        </button>
        <button
          className="mdTree-import emoji"
          onClick={onClickImport.bind(null, "add")}
        >
          📩Import(Add)
        </button>
        <button className="mdTree-export emoji" onClick={onClickExport}>
          💾Export
        </button>
      </section>
    </article>
  );
};
