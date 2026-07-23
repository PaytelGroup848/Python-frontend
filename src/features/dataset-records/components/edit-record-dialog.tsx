"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
    DatasetRecord,
    UpdateDatasetRecordRequest,
} from "../types/dataset-record";

interface Props {

    open: boolean;

    record: DatasetRecord | null;

    onClose(): void;

    onSubmit(
        request: UpdateDatasetRecordRequest,
    ): Promise<void>;

}

export function EditRecordDialog({

    open,

    record,

    onClose,

    onSubmit,

}: Props) {

    const [

        input,

        setInput,

    ] = useState("");

    const [

        output,

        setOutput,

    ] = useState("");

    const [

        externalId,

        setExternalId,

    ] = useState("");

    const [

        status,

        setStatus,

    ] = useState("");

    useEffect(() => {

        if (!record) {

            return;

        }

        setInput(
            record.input,
        );

        setOutput(
            record.output,
        );

        setExternalId(
            record.external_id ?? "",
        );

        setStatus(
            record.status,
        );

    }, [record]);

    async function handleSubmit() {

        await onSubmit({

            input,

            output,

            external_id:
                externalId || undefined,

            status,

        });

    }

    return (

        <Dialog

            open={open}

            onOpenChange={(value) => {

                if (!value) {

                    onClose();

                }

            }}

        >

            <DialogContent className="sm:max-w-3xl">

                <DialogHeader>

                    <DialogTitle>

                        Edit Record

                    </DialogTitle>

                    <DialogDescription>

                        Update dataset record.

                    </DialogDescription>

                </DialogHeader>

                <div className="space-y-4">

                    <Input

                        placeholder="External ID"

                        value={externalId}

                        onChange={(event) =>

                            setExternalId(

                                event.target.value,

                            )

                        }

                    />

                    <textarea

                        className="
                            min-h-[180px]
                            w-full
                            rounded-md
                            border
                            p-3
                        "

                        value={input}

                        onChange={(event) =>

                            setInput(

                                event.target.value,

                            )

                        }

                    />

                    <textarea

                        className="
                            min-h-[180px]
                            w-full
                            rounded-md
                            border
                            p-3
                        "

                        value={output}

                        onChange={(event) =>

                            setOutput(

                                event.target.value,

                            )

                        }

                    />

                    <Input

                        placeholder="Status"

                        value={status}

                        onChange={(event) =>

                            setStatus(

                                event.target.value,

                            )

                        }

                    />

                </div>

                <DialogFooter>

                    <Button

                        variant="outline"

                        onClick={onClose}

                    >

                        Cancel

                    </Button>

                    <Button

                        onClick={handleSubmit}

                    >

                        Save Changes

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    );

}