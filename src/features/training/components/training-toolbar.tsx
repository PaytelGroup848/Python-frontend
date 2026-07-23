"use client";

import {
    Plus,
    RefreshCw,
    Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TrainingToolbarProps {

    search: string;

    status: string;

    onSearchChange: (
        value: string,
    ) => void;

    onStatusChange: (
        value: string,
    ) => void;

    onRefresh: () => void;

    onCreateTraining: () => void;

}

export function TrainingToolbar({

    search,

    status,

    onSearchChange,

    onStatusChange,

    onRefresh,

    onCreateTraining,

}: TrainingToolbarProps) {

    return (

        <div
            className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
            "
        >

            <div
                className="
                    flex
                    flex-1
                    flex-col
                    gap-3
                    sm:flex-row
                "
            >

                <div className="relative flex-1">

                    <Search
                        className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-muted-foreground
                        "
                    />

                    <Input

                        value={
                            search
                        }

                        placeholder="Search training jobs..."

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

                    <SelectTrigger
                        className="200px"
                    >

                        <SelectValue
                            placeholder="Status"
                        />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="ALL">

                            All Status

                        </SelectItem>

                        <SelectItem value="PENDING">

                            Pending

                        </SelectItem>

                        <SelectItem value="QUEUED">

                            Queued

                        </SelectItem>

                        <SelectItem value="RUNNING">

                            Running

                        </SelectItem>

                        <SelectItem value="COMPLETED">

                            Completed

                        </SelectItem>

                        <SelectItem value="FAILED">

                            Failed

                        </SelectItem>

                    </SelectContent>

                </Select>

            </div>

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <Button

                    variant="outline"

                    onClick={
                        onRefresh
                    }

                >

                    <RefreshCw
                        className="mr-2 h-4 w-4"
                    />

                    Refresh

                </Button>

                <Button

                    onClick={
                        onCreateTraining
                    }

                >

                    <Plus
                        className="mr-2 h-4 w-4"
                    />

                    Create Training Job

                </Button>

            </div>

        </div>

    );

}