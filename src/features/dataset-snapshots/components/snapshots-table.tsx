"use client";

import {
    Eye,
    MoreHorizontal,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DatasetSnapshot,
} from "../types/dataset-snapshot";

import {
    SnapshotStatusBadge,
} from "./snapshot-status-badge";

interface SnapshotsTableProps {

    snapshots: DatasetSnapshot[];

    onView: (
        snapshotId: number,
    ) => void;

    onDelete: (
        snapshotId: number,
    ) => void;

}

export function SnapshotsTable({

    snapshots,

    onView,

    onDelete,

}: SnapshotsTableProps) {

    if (

        snapshots.length === 0

    ) {

        return (

            <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">

                No snapshots found.

            </div>

        );

    }

    return (

        <div className="rounded-lg border">

            <Table>

                <TableHeader>

                    <TableRow>

                        <TableHead>

                            ID

                        </TableHead>

                        <TableHead>

                            Snapshot

                        </TableHead>

                        <TableHead>

                            Version

                        </TableHead>

                        <TableHead>

                            Status

                        </TableHead>

                        <TableHead>

                            Records

                        </TableHead>

                        <TableHead>

                            Immutable

                        </TableHead>

                        <TableHead>

                            Created

                        </TableHead>

                        <TableHead className="w-[80px]">

                            Actions

                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {snapshots.map(

                        (

                            snapshot,

                        ) => (

                            <TableRow

                                key={

                                    snapshot.id

                                }

                            >

                                <TableCell>

                                    {snapshot.id}

                                </TableCell>

                                <TableCell>

                                    <div className="flex flex-col">

                                        <span className="font-medium">

                                            {

                                                snapshot.snapshot_name

                                            }

                                        </span>

                                        {snapshot.description && (

                                            <span className="text-xs text-muted-foreground">

                                                {

                                                    snapshot.description

                                                }

                                            </span>

                                        )}

                                    </div>

                                </TableCell>

                                <TableCell>

                                    {

                                        snapshot.snapshot_version

                                    }

                                </TableCell>

                                <TableCell>

                                    <SnapshotStatusBadge

                                        status={

                                            snapshot.status

                                        }

                                    />

                                </TableCell>

                                <TableCell>

                                    {

                                        snapshot.record_count

                                    }

                                </TableCell>

                                <TableCell>

                                    {snapshot.is_immutable

                                        ? "Yes"

                                        : "No"}

                                </TableCell>

                                <TableCell>

                                    {new Date(

                                        snapshot.created_at,

                                    ).toLocaleString()}

                                </TableCell>

                                <TableCell>

                                    <DropdownMenu>

                                        <DropdownMenuTrigger

                                            asChild

                                        >

                                            <Button

                                                variant="ghost"

                                                size="icon"

                                            >

                                                <MoreHorizontal className="h-4 w-4" />

                                            </Button>

                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent

                                            align="end"

                                        >

                                            <DropdownMenuItem

                                                onClick={() =>

                                                    onView(

                                                        snapshot.id,

                                                    )

                                                }

                                            >

                                                <Eye className="mr-2 h-4 w-4" />

                                                View

                                            </DropdownMenuItem>

                                            <DropdownMenuItem

                                                className="text-destructive"

                                                onClick={() =>

                                                    onDelete(

                                                        snapshot.id,

                                                    )

                                                }

                                            >

                                                <Trash2 className="mr-2 h-4 w-4" />

                                                Delete

                                            </DropdownMenuItem>

                                        </DropdownMenuContent>

                                    </DropdownMenu>

                                </TableCell>

                            </TableRow>

                        ),

                    )}

                </TableBody>

            </Table>

        </div>

    );

}