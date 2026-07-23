"use client";

interface Props {

    totalRecords: number;

    validRecords: number;

    invalidRecords: number;

    duplicateRecords: number;

    lastBuildAt: string | null;

}

export function BuilderSummary({

    totalRecords,

    validRecords,

    invalidRecords,

    duplicateRecords,

    lastBuildAt,

}: Props) {

    const cards = [

        {

            title: "Total Records",

            value: totalRecords,

        },

        {

            title: "Valid Records",

            value: validRecords,

        },

        {

            title: "Invalid Records",

            value: invalidRecords,

        },

        {

            title: "Duplicate Records",

            value: duplicateRecords,

        },

        {

            title: "Last Build",

            value: lastBuildAt
                ? new Date(
                    lastBuildAt,
                ).toLocaleString()
                : "Never",

        },

    ];

    return (

        <div
            className="
                grid
                gap-4
                md:grid-cols-2
                xl:grid-cols-5
            "
        >

            {

                cards.map(

                    (card) => (

                        <div

                            key={card.title}

                            className="
                                rounded-xl
                                border
                                bg-background
                                p-5
                            "

                        >

                            <div
                                className="
                                    text-sm
                                    text-muted-foreground
                                "
                            >

                                {card.title}

                            </div>

                            <div
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                "
                            >

                                {card.value}

                            </div>

                        </div>

                    )

                )

            }

        </div>

    );

}