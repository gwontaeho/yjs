"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function Home() {
  const [current, setCurrent] = useState(null);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = async () => {
    try {
      const res = await fetch(
        "https://yjs-server-9z38.onrender.com/api/documents"
      );
      const docs = await res.json();
      setDocs(docs);
    } catch (error) {
      console.log(error);
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
    </div>
  );
}
