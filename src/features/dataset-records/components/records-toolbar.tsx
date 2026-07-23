"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

interface Props {

    search: string;

    status: string;

    onSearchChange(
        value: string,
    ): void;

    onStatusChange(
        value: string,
    ): void;

    onRefresh(): void;

    onUploadRecords(): void;

}

export function RecordsToolbar({

    search,

    status,

    onSearchChange,

    onStatusChange,

    onRefresh,

    onUploadRecords,

}: Props) {

    return (

        <div
            className="
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-between
            "
        >

            <div
                className="
                    flex
                    flex-1
                    gap-3
                "
            >

                <Input

                    placeholder="Search records..."

                    value={search}

                    onChange={(event) =>

                        onSearchChange(

                            event.target.value,

                        )

                    }

                    className="max-w-md"

                />

                <Input

                    placeholder="Status"

                    value={status}

                    onChange={(event) =>

                        onStatusChange(

                            event.target.value,

                        )

                    }

                    className="w-44"

                />

            </div>

            <div
                className="
                    flex
                    gap-2
                "
            >

                <Button

                    variant="outline"

                    onClick={

                        onRefresh

                    }

                >

                    Refresh

                </Button>

                <Button

                    onClick={

                        onUploadRecords

                    }

                >

                    Upload Records

                </Button>

            </div>

        </div>

    );

}