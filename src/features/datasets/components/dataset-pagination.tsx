"use client";

import { Button } from "@/components/ui/button";

interface Props {

    page: number;

    totalPages: number;

    onPrevious(): void;

    onNext(): void;

    onPageChange(
        page: number,
    ): void;

}

export function DatasetPagination({

    page,

    totalPages,

    onPrevious,

    onNext,

    onPageChange,

}: Props) {

    return (

        <div
            className="
                mt-6
                flex
                items-center
                justify-between
            "
        >

            <Button

                variant="outline"

                disabled={page <= 1}

                onClick={onPrevious}

            >

                Previous

            </Button>

            <div
                className="
                    flex
                    gap-2
                "
            >

                {

                    Array.from(

                        {

                            length: totalPages,

                        }

                    ).map(

                        (_, index) => {

                            const value =
                                index + 1;

                            return (

                                <Button

                                    key={value}

                                    variant={

                                        value === page

                                            ? "default"

                                            : "outline"

                                    }

                                    onClick={() =>

                                        onPageChange(

                                            value

                                        )

                                    }

                                >

                                    {value}

                                </Button>

                            );

                        }

                    )

                }

            </div>

            <Button

                variant="outline"

                disabled={

                    page >= totalPages

                }

                onClick={onNext}

            >

                Next

            </Button>

        </div>

    );

}