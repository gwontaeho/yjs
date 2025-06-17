"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function Home() {
  const [current, setCurrent] = useState(null);
  const [docs, setDocs] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://yjs-server-9z38.onrender.com/api/documents"
      );
      const docs = await res.json();
      setDocs(docs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async () => {
    try {
      await fetch(
        `https://yjs-server-9z38.onrender.com/api/documents/${current}`,
        {
          method: "DELETE",
        }
      );
      setCurrent(null);
      getDocuments();
    } catch (error) {}
  };

  return (
    <div className="flex">
      <div className="flex flex-col w-40 mr-1">
        <button
          type="button"
          className="cursor-pointer border-r border-b hover:bg-gray-100"
          onClick={getDocuments}
        >
          Get Documents
        </button>
        <button
          type="button"
          className="cursor-pointer border-r border-b hover:bg-gray-100"
          onClick={() => setCurrent(crypto.randomUUID())}
        >
          New Document
        </button>
        {current && (
          <button
            type="button"
            className="cursor-pointer border-r border-b hover:bg-gray-100"
            onClick={() => deleteDocument()}
          >
            Delete Document
          </button>
        )}
      </div>

      <div className="flex flex-col w-40 mr-1">
        {docs.map((doc) => {
          return (
            <button
              key={doc}
              type="button"
              className="cursor-pointer border-l border-r border-b hover:bg-gray-100 aria-[current=page]:bg-gray-200"
              onClick={() => setCurrent(doc)}
              aria-current={doc === current ? "page" : "false"}
            >
              {doc.slice(0, 8)}
            </button>
          );
        })}
      </div>

      {current && <Editor name={current} />}

      {loading &&
        createPortal(
          <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/10">
            <svg
              className="mr-3 -ml-1 size-5 animate-spin text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>,
          document.body
        )}
    </div>
  );
}
