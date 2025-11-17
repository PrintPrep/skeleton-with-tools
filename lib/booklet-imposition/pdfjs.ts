import { GlobalWorkerOptions } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/pdf.worker.mjs?url";

// Required for pdfjs v5.x
GlobalWorkerOptions.workerSrc = workerSrc;

export * from "pdfjs-dist";
