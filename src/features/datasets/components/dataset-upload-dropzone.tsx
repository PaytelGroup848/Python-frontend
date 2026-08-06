"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

interface Props {

    onSelect: (
        file: File,
    ) => void;

}

export function DatasetUploadDropzone({

    onSelect,

}: Props) {

    const inputRef =
        useRef<HTMLInputElement>(null);

    return (

        <div
            className="
                rounded-xl
                border-2
                border-dashed
                p-10
                text-center
            "
        >

            <h3
                className="
                    text-lg
                    font-semibold
                "
            >
                Upload Dataset
            </h3>

            <p
                className="
                    mt-2
                    text-sm
                    text-gray-500
                "
            >
                CSV, JSON, JSONL, TXT, XLSX, DOCX, PDF
            </p>

            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.csv,.json,.jsonl,.parquet,.xlsx,*"
                hidden

                onChange={(event) => {

                    const file =
                        event.target.files?.[0];

                    if (file) {

                        onSelect(file);

                    }

                }}

            />

            <Button

                className="mt-6"

                onClick={() =>
                    inputRef.current?.click()
                }

            >
                Browse Files
            </Button>

        </div>

    );

}