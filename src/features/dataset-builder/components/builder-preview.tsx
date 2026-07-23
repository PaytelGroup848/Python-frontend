"use client";

import {
    DatasetPreviewSample,
} from "../types/dataset-builder";

interface Props {

    samples: DatasetPreviewSample[];

}

export function BuilderPreview({

    samples,

}: Props) {

    return (

        <div
            className="
                rounded-xl
                border
                p-6
                space-y-6
            "
        >

            <div>

                <h2
                    className="
                        text-xl
                        font-semibold
                    "
                >

                    Training Sample Preview

                </h2>

                <p
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >

                    Preview of formatted training samples before building the dataset.

                </p>

            </div>

            {

                samples.length === 0 && (

                    <div
                        className="
                            rounded-lg
                            border
                            p-6
                            text-center
                            text-muted-foreground
                        "
                    >

                        No preview samples available.

                    </div>

                )

            }

            {

                samples.map(

                    (sample) => (

                        <div

                            key={sample.id}

                            className="
                                rounded-lg
                                border
                                p-5
                                space-y-4
                            "

                        >

                            <div
                                className="
                                    text-sm
                                    font-medium
                                    text-muted-foreground
                                "
                            >

                                Sample #{sample.id}

                            </div>

                            <div
                                className="
                                    space-y-2
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            text-sm
                                            font-semibold
                                        "
                                    >

                                        Input

                                    </div>

                                    <pre
                                        className="
                                            mt-1
                                            whitespace-pre-wrap
                                            rounded-md
                                            border
                                            bg-muted
                                            p-3
                                            text-sm
                                        "
                                    >

                                        {sample.input}

                                    </pre>

                                </div>

                                <div>

                                    <div
                                        className="
                                            text-sm
                                            font-semibold
                                        "
                                    >

                                        Output

                                    </div>

                                    <pre
                                        className="
                                            mt-1
                                            whitespace-pre-wrap
                                            rounded-md
                                            border
                                            bg-muted
                                            p-3
                                            text-sm
                                        "
                                    >

                                        {sample.output}

                                    </pre>

                                </div>

                            </div>

                        </div>

                    )

                )

            }

        </div>

    );

}