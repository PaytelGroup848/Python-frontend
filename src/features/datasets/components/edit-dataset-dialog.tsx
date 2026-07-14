"use client";

import { useEffect, useState } from "react";

import { Dataset } from "../types/dataset";

import {
    UpdateDatasetRequest,
} from "../types/dataset";

interface Props {

    open: boolean;

    dataset: Dataset | null;

    onClose: () => void;

    onSubmit: (
        payload: UpdateDatasetRequest,
    ) => Promise<void>;

}

export function EditDatasetDialog({

    open,

    dataset,

    onClose,

    onSubmit,

}: Props) {

    const [name, setName] =
        useState("");

    const [domain, setDomain] =
        useState("");

    const [version, setVersion] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [source, setSource] =
        useState("");

    useEffect(() => {

        if (!dataset) {

            return;

        }

        setName(
            dataset.name,
        );

        setDomain(
            dataset.domain,
        );

        setVersion(
            dataset.version,
        );

        setDescription(
            dataset.description ?? "",
        );

        setSource(
            dataset.source ?? "",
        );

    }, [dataset]);

    if (!open || !dataset) {

        return null;

    }

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
            "
        >

            <div
                className="
                    w-full
                    max-w-xl
                    rounded-xl
                    bg-white
                    p-6
                "
            >

                <h2
                    className="
                        mb-6
                        text-2xl
                        font-semibold
                    "
                >
                    Edit Dataset
                </h2>

                <div className="space-y-4">

                    <input
                        className="w-full rounded border p-3"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value,
                            )
                        }
                        placeholder="Dataset Name"
                    />

                    <input
                        className="w-full rounded border p-3"
                        value={domain}
                        onChange={(e) =>
                            setDomain(
                                e.target.value,
                            )
                        }
                        placeholder="Domain"
                    />

                    <input
                        className="w-full rounded border p-3"
                        value={version}
                        onChange={(e) =>
                            setVersion(
                                e.target.value,
                            )
                        }
                        placeholder="Version"
                    />

                    <textarea
                        className="w-full rounded border p-3"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value,
                            )
                        }
                        placeholder="Description"
                    />

                    <input
                        className="w-full rounded border p-3"
                        value={source}
                        onChange={(e) =>
                            setSource(
                                e.target.value,
                            )
                        }
                        placeholder="Source"
                    />

                </div>

                <div
                    className="
                        mt-6
                        flex
                        justify-end
                        gap-3
                    "
                >

                    <button
                        className="
                            rounded-lg
                            border
                            px-5
                            py-2
                        "
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="
                            rounded-lg
                            bg-black
                            px-5
                            py-2
                            text-white
                        "
                        onClick={async () => {

                            await onSubmit({

                                name,

                                domain,

                                version,

                                description,

                                source,

                            });

                            onClose();

                        }}
                    >
                        Update Dataset
                    </button>

                </div>

            </div>

        </div>

    );

}