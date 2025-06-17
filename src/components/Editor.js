"use client";

import "quill/dist/quill.snow.css";

import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import { useEffect, useRef } from "react";

const Editor = (props) => {
  const { name } = props;

  const wrapperRef = useRef(null);
  const quillContainerRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const newEditorDiv = document.createElement("div");
    wrapperRef.current.innerHTML = "";
    wrapperRef.current.appendChild(newEditorDiv);
    quillContainerRef.current = newEditorDiv;

    const ydoc = new Y.Doc();
    const ws = new WebSocket(`wss://yjs-server-9z38.onrender.com/${name}`);
    const ytext = ydoc.getText("quill");

    ws.onmessage = async (event) => {
      const arrayBuffer = await event.data.arrayBuffer();
      const update = new Uint8Array(arrayBuffer);
      try {
        Y.applyUpdate(ydoc, update);
      } catch (e) {
        console.error("❌ applyUpdate 실패:", e.message);
      }
    };

    ydoc.on("update", (update) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(update);
      }
    });

    const quill = new Quill(quillContainerRef.current, {
      theme: "snow",
      modules: {
        toolbar: [[{ header: [1, 2, false] }], ["bold", "italic"]],
      },
    });

    const binding = new QuillBinding(ytext, quill);

    return () => {
      ws.close();
      ydoc.destroy();
      binding.destroy?.();
      quill.off?.();
    };
  }, [name]);

  return <div ref={wrapperRef}></div>;
};

export default Editor;
