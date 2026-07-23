"use client";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
    DatasetBuilderConfiguration,
} from "../types/dataset-builder";

interface Props {

    configuration: DatasetBuilderConfiguration;

    onChange(
        configuration: DatasetBuilderConfiguration,
    ): void;

    onReset(): void;

}

export function BuilderConfiguration({

    configuration,

    onChange,

    onReset,

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

                    Build Configuration

                </h2>

                <p
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >

                    Configure how this dataset will be prepared before snapshot generation.

                </p>

            </div>

            <div
                className="
                    grid
                    gap-4
                    md:grid-cols-3
                "
            >

                <div>

                    <label className="text-sm font-medium">

                        Train Split

                    </label>

                    <Input

                        type="number"

                        value={configuration.train_split}

                        onChange={(event) =>

                            onChange({

                                ...configuration,

                                train_split: Number(

                                    event.target.value,

                                ),

                            })

                        }

                    />

                </div>

                <div>

                    <label className="text-sm font-medium">

                        Validation Split

                    </label>

                    <Input

                        type="number"

                        value={configuration.validation_split}

                        onChange={(event) =>

                            onChange({

                                ...configuration,

                                validation_split: Number(

                                    event.target.value,

                                ),

                            })

                        }

                    />

                </div>

                <div>

                    <label className="text-sm font-medium">

                        Test Split

                    </label>

                    <Input

                        type="number"

                        value={configuration.test_split}

                        onChange={(event) =>

                            onChange({

                                ...configuration,

                                test_split: Number(

                                    event.target.value,

                                ),

                            })

                        }

                    />

                </div>

            </div>

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <input

                    id="shuffle"

                    type="checkbox"

                    checked={configuration.shuffle}

                    onChange={(event) =>

                        onChange({

                            ...configuration,

                            shuffle:

                                event.target.checked,

                        })

                    }

                />

                <label htmlFor="shuffle">

                    Shuffle Dataset

                </label>

            </div>

            <div>

                <label className="text-sm font-medium">

                    Random Seed

                </label>

                <Input

                    type="number"

                    value={configuration.random_seed ?? ""}

                    onChange={(event) =>

                        onChange({

                            ...configuration,

                            random_seed:

                                event.target.value === ""

                                    ? null

                                    : Number(

                                        event.target.value,

                                    ),

                        })

                    }

                />

            </div>

            <div
                className="
                    flex
                    justify-end
                "
            >

                <Button

                    variant="outline"

                    onClick={onReset}

                >

                    Reset Configuration

                </Button>

            </div>

        </div>

    );

}