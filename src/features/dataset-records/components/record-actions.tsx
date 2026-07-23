"use client";

import { Button } from "@/components/ui/button";

interface Props {

    recordId: number;

    onView(
        recordId: number,
    ): void;

    onEdit(
        recordId: number,
    ): void;

    onDelete(
        recordId: number,
    ): void;

}

export function RecordActions({

    recordId,

    onView,

    onEdit,

    onDelete,

}: Props) {

    return (

        <div
            className="
                flex
                gap-2
            "
        >

            <Button

                size="sm"

                onClick={() =>

                    onView(

                        recordId,

                    )

                }

            >

                View

            </Button>

            <Button

                size="sm"

                variant="outline"

                onClick={() =>

                    onEdit(

                        recordId,

                    )

                }

            >

                Edit

            </Button>

            <Button

                size="sm"

                variant="destructive"

                onClick={() =>

                    onDelete(

                        recordId,

                    )

                }

            >

                Delete

            </Button>

        </div>

    );

}