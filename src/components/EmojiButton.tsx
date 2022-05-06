import { ComponentPropsWithoutRef, ReactNode } from "react";
import "./EmojiButton.css";

interface Props extends ComponentPropsWithoutRef<"button"> {
  emoji: string;
  children?: ReactNode | ReactNode[];
};

export const EmojiButton = ({ emoji, children, ...rest }: Props) => (
  <button className="emojiButton" {...rest}>
    <span className="emojiButton-emoji">{emoji}</span>
    <span className="emojiButton-body">{children}</span>
  </button>
);
