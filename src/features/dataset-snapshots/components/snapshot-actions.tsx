"use client";

import {
    Eye,
    Lock,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SnapshotActionsProps {

    snapshotId: number;

    status: string;

    onView: (
        snapshotId: number,
    ) => void;

    onSeal: (
        snapshotId: number,
    ) => void;

    onDelete: (
        snapshotId: number,
    ) => void;

}

export function SnapshotActions({

    snapshotId,

    status,

    onView,

    onSeal,

    onDelete,

}: SnapshotActionsProps) {

    const isSealed =
        status.trim().toUpperCase() ===
        "SEALED";

    return (

        <DropdownMenu>

            <DropdownMenuTrigger
                asChild
            >

                <Button
                    variant="ghost"
                    size="icon"
                >

                    <Eye className="h-4 w-4" />

                </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
            >

                <DropdownMenuItem
                    onClick={() =>
                        onView(
                            snapshotId,
                        )
                    }
                >

                    <Eye className="mr-2 h-4 w-4" />

                    View Details

                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={
                        isSealed
                    }
                    onClick={() =>
                        onSeal(
                            snapshotId,
                        )
                    }
                >

                    <Lock className="mr-2 h-4 w-4" />

                    Seal Snapshot

                </DropdownMenuItem>

                <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                        onDelete(
                            snapshotId,
                        )
                    }
                >

                    <Trash2 className="mr-2 h-4 w-4" />

                    Delete Snapshot

                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>

    );

}