"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CreateDatasetRequest } from "../types/dataset";

interface Props {

    open: boolean;

    onClose: () => void;

    onSubmit: (
        payload: CreateDatasetRequest,
    ) => Promise<void>;

}

export function CreateDatasetDialog({

    open,

    onClose,

    onSubmit,

}: Props) {

    const [corpusId, setCorpusId] =
        useState("");

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

    if (!open) {

        return null;

    }

    return (

        <div
            className="
                fixed inset-0
                z-50
                flex items-center justify-center
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
                        text-xl
                        font-semibold
                    "
                >
                    Create Dataset
                </h2>

                <div className="space-y-4">

                    <Input
                        type="number"
                        placeholder="Corpus Id"
                        value={corpusId}
                        onChange={(e) =>
                            setCorpusId(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Dataset Name"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Domain"
                        value={domain}
                        onChange={(e) =>
                            setDomain(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Version"
                        value={version}
                        onChange={(e) =>
                            setVersion(
                                e.target.value
                            )
                        }
                    />

                    <textarea
                        className="
                            w-full
                            rounded-lg
                            border
                            p-3
                        "
                        rows={4}
                        placeholder="Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Source"
                        value={source}
                        onChange={(e) =>
                            setSource(
                                e.target.value
                            )
                        }
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

                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button

                        onClick={async () => {

                            await onSubmit({

                                corpus_id:
                                    Number(
                                        corpusId
                                    ),

                                name,

                                domain,

                                version,

                                description,

                                source,

                            });

                            onClose();

                        }}

                    >
                        Create Dataset
                    </Button>

                </div>

            </div>

        </div>

    );

}