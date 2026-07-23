"use client";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface TrainingPaginationProps {

    page: number;

    totalPages: number;

    totalItems: number;

    pageSize: number;

    onPageChange: (
        page: number,
    ) => void;

}

export function TrainingPagination({

    page,

    totalPages,

    totalItems,

    pageSize,

    onPageChange,

}: TrainingPaginationProps) {

    const firstItem =

        totalItems === 0

            ? 0

            : (page - 1) * pageSize + 1;

    const lastItem =

        Math.min(

            page * pageSize,

            totalItems,

        );

    return (

        <div
            className="
                flex
                flex-col
                gap-4
                border-t
                pt-4
                md:flex-row
                md:items-center
                md:justify-between
            "
        >

            <div
                className="
                    text-sm
                    text-muted-foreground
                "
            >

                Showing{" "}

                <span className="font-medium">

                    {firstItem}

                </span>

                {" "}to{" "}

                <span className="font-medium">

                    {lastItem}

                </span>

                {" "}of{" "}

                <span className="font-medium">

                    {totalItems}

                </span>

                {" "}training jobs

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

                    size="sm"

                    disabled={

                        page <= 1

                    }

                    onClick={() =>

                        onPageChange(

                            page - 1,

                        )

                    }

                >

                    <ChevronLeft className="h-4 w-4 mr-1" />

                    Previous

                </Button>

                <div
                    className="
                        min-w-[120px]
                        text-center
                        text-sm
                        font-medium
                    "
                >

                    Page {page} of {Math.max(totalPages, 1)}

                </div>

                <Button

                    variant="outline"

                    size="sm"

                    disabled={

                        page >= totalPages ||

                        totalPages === 0

                    }

                    onClick={() =>

                        onPageChange(

                            page + 1,

                        )

                    }

                >

                    Next

                    <ChevronRight className="ml-1 h-4 w-4" />

                </Button>

            </div>

        </div>

    );

}