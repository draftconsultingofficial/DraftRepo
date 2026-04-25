"use client";

import { useState } from "react";

interface DocumentViewerProps {
  fileUrl: string;
  fileName: string;
  fileType?: "pdf" | "image";
}

export function DocumentViewer({ fileUrl, fileName, fileType = "pdf" }: DocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPDF = fileUrl.endsWith(".pdf") || fileType === "pdf";
  const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-gray-900">{fileName}</p>
        <div className="flex gap-2">
          <a
            href={fileUrl}
            download={fileName}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
          {isPDF && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 transition"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Fullscreen
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      {isPDF && (
        <>
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-96">
            <iframe
              src={`${fileUrl}#toolbar=0`}
              className="w-full h-full"
              title={`Preview of ${fileName}`}
            />
          </div>

          {/* Fullscreen Modal */}
          {isFullscreen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full h-screen flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                  <p className="font-medium text-gray-900">{fileName}</p>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <iframe
                  src={`${fileUrl}#toolbar=1`}
                  className="flex-1"
                  title={`Full preview of ${fileName}`}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Image Viewer */}
      {isImage && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <img
            src={fileUrl}
            alt={fileName}
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      {/* Unsupported Format */}
      {!isPDF && !isImage && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          <p className="font-medium">Preview not available for this file type</p>
          <p className="mt-1 text-xs">
            <a href={fileUrl} download={fileName} className="underline hover:no-underline">
              Click here to download
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
