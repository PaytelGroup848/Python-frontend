"use client";

import {
    useEffect,
    useState,
} from "react";

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

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
    CreateDatasetSnapshotRequest,
} from "../types/dataset-snapshot";

interface CreateSnapshotDialogProps {

    open: boolean;

    datasetId: number;

    loading?: boolean;

    onClose: () => void;

    onSubmit: (
        request: CreateDatasetSnapshotRequest,
    ) => Promise<void>;

}

export function CreateSnapshotDialog({

    open,

    datasetId,

    loading = false,

    onClose,

    onSubmit,

}: CreateSnapshotDialogProps) {

    const [

        snapshotName,

        setSnapshotName,

    ] = useState("");

    const [

        description,

        setDescription,

    ] = useState("");

    useEffect(() => {

        if (

            open

        ) {

            setSnapshotName("");

            setDescription("");

        }

    }, [

        open,

    ]);

    async function handleSubmit() {

        if (

            !snapshotName.trim()

        ) {

            return;

        }

        await onSubmit({

            dataset_id: datasetId,

            snapshot_name:

                snapshotName.trim(),

            description:

                description.trim() ||

                null,

            metadata_json: {},

        });

        onClose();

    }

    return (

        <Dialog

            open={

                open

            }

            onOpenChange={(value) => {

                if (

                    !value

                ) {

                    onClose();

                }

            }}

        >

            <DialogContent className="sm:max-w-lg">

                <DialogHeader>

                    <DialogTitle>

                        Create Dataset Snapshot

                    </DialogTitle>

                    <DialogDescription>

                        Create an immutable
                        snapshot of the current
                        dataset for training.

                    </DialogDescription>

                </DialogHeader>

                <div className="space-y-4 py-4">

                    <div className="space-y-2">

                        <Label>

                            Snapshot Name

                        </Label>

                        <Input

                            value={

                                snapshotName

                            }

                            placeholder="Enter snapshot name"

                            onChange={(event) =>

                                setSnapshotName(

                                    event.target.value,

                                )

                            }

                        />

                    </div>

                    <div className="space-y-2">

                        <Label>

                            Description

                        </Label>

                        <Textarea

                            value={

                                description

                            }

                            rows={4}

                            placeholder="Optional description"

                            onChange={(event) =>

                                setDescription(

                                    event.target.value,

                                )

                            }

                        />

                    </div>

                </div>

                <DialogFooter>

                    <Button

                        variant="outline"

                        onClick={

                            onClose

                        }

                    >

                        Cancel

                    </Button>

                    <Button

                        disabled={

                            loading ||

                            !snapshotName.trim()

                        }

                        onClick={

                            handleSubmit

                        }

                    >

                        Create Snapshot

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    );

}