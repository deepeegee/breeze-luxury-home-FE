"use client";

import React, { useMemo } from "react";

const MAX_PREVIEW_CHARS = 420;

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

  const accId = "desc-accordion";
  const collapseId = `${accId}-collapse`;
  const headerId = `${accId}-header`;

  return (
    <>
      <p className="text mb10">{preview}</p>

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
                  <p className="text">{remainder}</p>
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
    </>
  );
};

export default ProperytyDescriptions;
