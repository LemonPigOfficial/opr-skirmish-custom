import { useState } from "react";
import { CustomTooltip } from "./CustomTooltip";

interface RuleItemProps {
  label: string;
  description: string;
}

export default function RuleItem({ label, description }: RuleItemProps) {
  const [open, setOpen] = useState(false);

  const bullet = /•|/;
  const descParts = description.split(bullet).map((part) => <p key={part}>{part}</p>);

  let content = description ? (
    <CustomTooltip
      title={descParts}
      arrow
      open={open}
      //leaveDelay={10000}
      leaveTouchDelay={5 * 60 * 1000}
      onClose={() => setOpen(false)}
      onClick={(e: any) => {
        e.stopPropagation();
        setOpen(true);
      }}
      onMouseOver={() => setOpen(true)}
      onMouseOut={() => setOpen(false)}
    >
      <span
        className="rule-list-item"
        style={{
          userSelect: "none",
          textDecoration: "underline",
          textDecorationStyle: "dashed",
          textUnderlineOffset: "4px",
        }}
      >
        {label}
      </span>
    </CustomTooltip>
  ) : (
    <span className="rule-list-item">{label}</span>
  );

  return content;
}
