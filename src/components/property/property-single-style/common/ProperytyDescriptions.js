"use client";
import React, { useMemo } from "react";

const MAX_PREVIEW_CHARS = 420;

// Tokens that count as a bullet prefix
const BULLET_RE = /^[\-\u2022\u25CF\u2023\u2043\u2219•–—▪▫◦·✅☑️✔️]\s?/;

// Split into logical blocks by 2+ newlines; trim empty
function splitBlocks(text) {
  return text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
}

// Render one block as either a UL or a paragraph
function Block({ text, blockIndex }) {
  const lines = useMemo(
    () =>
      text
        .split(/\n/)
        .map((l) => l.trimEnd())
        .filter((l) => l !== ""),
    [text]
  );

  if (lines.length === 0) return null;

  // If most lines are bullet-like, treat as a list
  const bulletish = lines.filter((l) => BULLET_RE.test(l));
  const looksLikeList = bulletish.length >= Math.max(2, Math.ceil(lines.length / 2));

  // Special case: heading line ending with ":" followed by bullet lines (e.g. "Top Features:")
  const firstLine = lines[0];
  const isHeadingThenList = /:\s*$/.test(firstLine) && lines.slice(1).some((l) => BULLET_RE.test(l));

  if (isHeadingThenList) {
    const heading = firstLine.replace(/:\s*$/, "");
    const items = lines.slice(1).filter((l) => l !== "");

    return (
      <div className="mb10" key={`blk-${blockIndex}-hl`}>
        <div className="fz16 fw600 mb5">{heading}</div>
        <ul className="desc-ul">
          {items.map((l, i) => (
            <li key={`blk-${blockIndex}-li-${i}`}>{l.replace(BULLET_RE, "")}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (looksLikeList) {
    return (
      <ul className="desc-ul mb10" key={`blk-${blockIndex}-ul`}>
        {lines.map((l, i) => (
          <li key={`blk-${blockIndex}-li-${i}`}>{l.replace(BULLET_RE, "")}</li>
        ))}
      </ul>
    );
  }

  // Paragraph: preserve single newlines with <br />
  return (
    <p className="text mb10" key={`blk-${blockIndex}-p`}>
      {lines.map((l, i) => (
        <React.Fragment key={`blk-${blockIndex}-ln-${i}`}>
          {l}
          {i < lines.length - 1 && <br key={`blk-${blockIndex}-br-${i}`} />}
        </React.Fragment>
      ))}
    </p>
  );
}

const ProperytyDescriptions = ({ description }) => {
  const text = String(description || "");

  if (!text.trim()) {
    return <p className="text mb10">No description provided.</p>;
  }

  const { preview, remainder } = useMemo(() => {
    if (text.length <= MAX_PREVIEW_CHARS) {
      return { preview: text, remainder: "" };
    }
    const cutAt = text.lastIndexOf(" ", MAX_PREVIEW_CHARS);
    const head = text.slice(0, cutAt > 0 ? cutAt : MAX_PREVIEW_CHARS);
    const tail = text.slice(head.length).trim();
    return { preview: head, remainder: tail };
  }, [text]);

  const previewBlocks = useMemo(() => splitBlocks(preview), [preview]);
  const remainderBlocks = useMemo(() => splitBlocks(remainder), [remainder]);

  const accId = "desc-accordion";
  const collapseId = `${accId}-collapse`;
  const headerId = `${accId}-header`;

  return (
    <>
      {previewBlocks.map((b, i) => (
        <Block key={`preview-blk-${i}`} text={b} blockIndex={`p${i}`} />
      ))}

      {remainder && (
        <div className="agent-single-accordion">
          <div className="accordion accordion-flush" id={accId}>
            <div className="accordion-item">
              <div
                id={collapseId}
                className="accordion-collapse collapse"
                aria-labelledby={headerId}
                data-bs-parent={`#${accId}`}
              >
                <div className="accordion-body p-0">
                  {remainderBlocks.map((b, i) => (
                    <Block key={`remainder-blk-${i}`} text={b} blockIndex={`r${i}`} />
                  ))}
                </div>
              </div>
              <h2 className="accordion-header" id={headerId}>
                <button
                  className="accordion-button p-0 collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${collapseId}`}
                  aria-expanded="false"
                  aria-controls={collapseId}
                >
                  Show more
                </button>
              </h2>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .desc-ul {
          margin: 0 0 10px 1rem;
          padding: 0;
        }
        .desc-ul li {
          margin: 0 0 6px 0;
        }
      `}</style>
    </>
  );
};

export default ProperytyDescriptions;