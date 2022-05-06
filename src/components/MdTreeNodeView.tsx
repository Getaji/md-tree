import { useState, useEffect } from "react";
import produce from "immer";

import { EmojiButton } from "./EmojiButton";
import { toHTML as markdownToHTML } from "@/markdown";
import "./MdTreeNodeView.css";

import type { MdTreeNode } from "@/types";

type Props = {
  node: MdTreeNode;
  isRoot?: boolean;
  onChangeNode?: (node: MdTreeNode) => void;
  onDeleteNode?: (node: MdTreeNode) => void;
};

export const MdTreeNodeView = ({
  node,
  isRoot = false,
  onChangeNode: nodeChangeHandler,
  onDeleteNode: nodeDeleteHandler,
}: Props) => {
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
      if (!isRoot) nodeDeleteHandler?.(node);
    }
  };
  const onChangeNode = (node: MdTreeNode, i: number) => {
    const newNode = produce(node, (draft) => {
      draft.children[i] = node;
    });
    nodeChangeHandler?.(newNode);
  };
  const onDeleteNode = (_: MdTreeNode, i: number) => {
    const newNode = produce(node, (draft) => {
      draft.children.splice(i, 1);
    });
    nodeChangeHandler?.(newNode);
  };
  const onClickAddChild = () => {
    const newNode = produce(node, (draft) => {
      draft.children.push({
        content: "",
        children: [],
      });
    });
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
          <>
            <EmojiButton emoji="✔️" onClick={onClickOK}>OK</EmojiButton>
            <EmojiButton emoji="❌" onClick={onClickCancel}>Cancel</EmojiButton>
          </>
        ) : (
          <EmojiButton emoji="✒️" onClick={onClickEdit}>Edit</EmojiButton>
        )}

        {!isRoot && (
          <EmojiButton emoji="🗑️" onClick={onClickDelete}>Delete</EmojiButton>
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
        <EmojiButton emoji="➕" onClick={onClickAddChild}>Delete</EmojiButton>
        <EmojiButton emoji="📩" onClick={onClickImport.bind(null, "overwrite")}>Import(Overwrite)</EmojiButton>
        <EmojiButton emoji="📩" onClick={onClickImport.bind(null, "add")}>Import(Add)</EmojiButton>
        <EmojiButton emoji="💾" onClick={onClickExport}>Export</EmojiButton>
      </section>
    </article>
  );
};
