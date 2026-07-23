"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    Separator,
} from "@/components/ui/separator";

import {
    DatasetSnapshot,
} from "../types/dataset-snapshot";

import {
    SnapshotStatusBadge,
} from "./snapshot-status-badge";

interface SnapshotDetailsDialogProps {

    open: boolean;

    snapshot: DatasetSnapshot | null;

    onClose: () => void;

}

export function SnapshotDetailsDialog({

    open,

    snapshot,

    onClose,

}: SnapshotDetailsDialogProps) {

    if (

        !snapshot

    ) {

        return null;

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

            <DialogContent className="max-w-2xl">

                <DialogHeader>

                    <DialogTitle>

                        Snapshot Details

                    </DialogTitle>

                    <DialogDescription>

                        View dataset snapshot information.

                    </DialogDescription>

                </DialogHeader>

                <div className="space-y-6">

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Snapshot ID

                            </p>

                            <p className="font-medium">

                                {snapshot.id}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Dataset ID

                            </p>

                            <p className="font-medium">

                                {snapshot.dataset_id}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Snapshot Name

                            </p>

                            <p className="font-medium">

                                {snapshot.snapshot_name}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Version

                            </p>

                            <p className="font-medium">

                                {snapshot.snapshot_version}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Status

                            </p>

                            <SnapshotStatusBadge

                                status={

                                    snapshot.status

                                }

                            />

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Immutable

                            </p>

                            <p className="font-medium">

                                {snapshot.is_immutable

                                    ? "Yes"

                                    : "No"}

                            </p>

                        </div>

                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Record Count

                            </p>

                            <p className="font-medium">

                                {snapshot.record_count}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Max Record ID

                            </p>

                            <p className="font-medium">

                                {snapshot.max_record_id ?? "-"}

                            </p>

                        </div>

                        <div className="col-span-2">

                            <p className="text-sm text-muted-foreground">

                                Content Hash

                            </p>

                            <p className="break-all font-mono text-xs">

                                {snapshot.content_hash ?? "-"}

                            </p>

                        </div>

                    </div>

                    <Separator />

                    <div>

                        <p className="mb-2 text-sm text-muted-foreground">

                            Description

                        </p>

                        <div className="rounded-md border p-3 text-sm">

                            {snapshot.description ||

                                "No description"}

                        </div>

                    </div>

                    <Separator />

                    <div>

                        <p className="mb-2 text-sm text-muted-foreground">

                            Metadata

                        </p>

                        <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">

                            {JSON.stringify(

                                snapshot.metadata_json ??

                                    {},

                                null,

                                2,

                            )}

                        </pre>

                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Created At

                            </p>

                            <p className="font-medium">

                                {new Date(

                                    snapshot.created_at,

                                ).toLocaleString()}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Updated At

                            </p>

                            <p className="font-medium">

                                {new Date(

                                    snapshot.updated_at,

                                ).toLocaleString()}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground">

                                Sealed At

                            </p>

                            <p className="font-medium">

                                {snapshot.sealed_at

                                    ? new Date(

                                          snapshot.sealed_at,

                                      ).toLocaleString()

                                    : "-"}

                            </p>

                        </div>

                    </div>

                </div>

                <DialogFooter>

                    <Button

                        onClick={

                            onClose

                        }

                    >

                        Close

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    );

}