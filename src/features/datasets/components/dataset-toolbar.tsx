"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {

    search: string;

    domain: string;

    status: string;

    corpus: string;

    onSearchChange(
        value: string,
    ): void;

    onDomainChange(
        value: string,
    ): void;

    onStatusChange(
        value: string,
    ): void;

    onCorpusChange(
        value: string,
    ): void;

    onRefresh(): void;

    onCreateDataset(): void;

}
export function DatasetToolbar({

    search,

    domain,

    status,

    corpus,

    onSearchChange,

    onDomainChange,

    onStatusChange,

    onCorpusChange,

    onRefresh,

    onCreateDataset,

}: Props) {


    return (

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <Input

                placeholder="Search datasets..."

                value={search}

                onChange={(event) =>

                    onSearchChange(

                        event.target.value,

                    )

                }

                className="max-w-md"

            />

            <Input

                placeholder="Domain"

                value={domain}

                onChange={(event) =>

                    onDomainChange(

                        event.target.value,

                    )

                }

                className="w-44"

            />


            <Input

                placeholder="Status"

                value={status}

                onChange={(event) =>

                    onStatusChange(

                        event.target.value,

                    )

                }

                className="w-40"

            />

            <Input

                placeholder="Corpus"

                value={corpus}

                onChange={(event) =>

                    onCorpusChange(

                        event.target.value,

                    )

                }

                className="w-44"

            />

            <div className="flex gap-2">

                <Button

                    variant="outline"

                    onClick={onRefresh}

                >

                    Refresh

                </Button>

                <Button

                    onClick={onCreateDataset}

                >

                    New Dataset

                </Button>

            </div>

        </div>

    );

}