"use client";

import {
    RefreshCw,
    Plus,
    Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SnapshotsToolbarProps {

    search: string;

    status: string;

    onSearchChange: (
        value: string,
    ) => void;

    onStatusChange: (
        value: string,
    ) => void;

    onRefresh: () => void;

    onCreateSnapshot: () => void;

}

export function SnapshotsToolbar({

    search,

    status,

    onSearchChange,

    onStatusChange,

    onRefresh,

    onCreateSnapshot,

}: SnapshotsToolbarProps) {

    return (

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex flex-1 flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input

                        value={

                            search

                        }

                        placeholder="Search snapshots..."

                        className="pl-9"

                        onChange={(event) =>

                            onSearchChange(

                                event.target.value,

                            )

                        }

                    />

                </div>

                <Select

                    value={

                        status || "ALL"

                    }

                    onValueChange={(value) =>

                        onStatusChange(

                            value === "ALL"

                                ? ""

                                : value,

                        )

                    }

                >

                    <SelectTrigger className="w-[180px]">

                        <SelectValue placeholder="Status" />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="ALL">

                            All Status

                        </SelectItem>

                        <SelectItem value="BUILDING">

                            Building

                        </SelectItem>

                        <SelectItem value="SEALED">

                            Sealed

                        </SelectItem>

                        <SelectItem value="FAILED">

                            Failed

                        </SelectItem>

                    </SelectContent>

                </Select>

            </div>

            <div className="flex items-center gap-2">

                <Button

                    variant="outline"

                    onClick={

                        onRefresh

                    }

                >

                    <RefreshCw className="mr-2 h-4 w-4" />

                    Refresh

                </Button>

                <Button

                    onClick={

                        onCreateSnapshot

                    }

                >

                    <Plus className="mr-2 h-4 w-4" />

                    Create Snapshot

                </Button>

            </div>

        </div>

    );

}