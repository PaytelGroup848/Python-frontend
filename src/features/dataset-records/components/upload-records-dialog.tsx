"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {

    open: boolean;

    onClose(): void;

    onUpload(
        file: File,
    ): Promise<void>;

}

export function UploadRecordsDialog({

    open,

    onClose,

    onUpload,

}: Props) {

    const [

        file,

        setFile,

    ] = useState<File | null>(

        null,

    );

    const [

        isUploading,

        setIsUploading,

    ] = useState(false);

    async function handleUpload() {

        if (

            file == null

        ) {

            return;

        }

        setIsUploading(

            true,

        );

        try {

            await onUpload(

                file,

            );

            setFile(

                null,

            );

            onClose();

        }

        finally {

            setIsUploading(

                false,

            );

        }

    }

    return (

        <Dialog

            open={open}

            onOpenChange={(value) => {

                if (

                    !value

                ) {

                    setFile(

                        null,

                    );

                    onClose();

                }

            }}

        >

            <DialogContent className="sm:max-w-lg">

                <DialogHeader>

                    <DialogTitle>

                        Upload Dataset Records

                    </DialogTitle>

                    <DialogDescription>

                        Select a dataset file to import records.

                    </DialogDescription>

                </DialogHeader>

                <div className="space-y-4">

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.csv,.json,.jsonl,.parquet,.xlsx,*"
                        onChange={(event) => {

                            const selected =

                                event.target.files?.[0];

                            if (

                                selected

                            ) {

                                setFile(

                                    selected,

                                );

                            }

                        }}

                    />

                    {

                        file && (

                            <div className="rounded border p-3 text-sm">

                                <div>

                                    <strong>

                                        File:

                                    </strong>{" "}

                                    {file.name}

                                </div>

                                <div>

                                    <strong>

                                        Size:

                                    </strong>{" "}

                                    {(

                                        file.size /

                                        1024

                                    ).toFixed(2)}{" "}

                                    KB

                                </div>

                            </div>

                        )

                    }

                </div>

                <DialogFooter>

                    <Button

                        variant="outline"

                        onClick={onClose}

                    >

                        Cancel

                    </Button>

                    <Button

                        disabled={

                            file == null ||

                            isUploading

                        }

                        onClick={

                            handleUpload

                        }

                    >

                        {

                            isUploading

                                ? "Uploading..."

                                : "Upload"

                        }

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    );

}