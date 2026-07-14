"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDatasetStore } from "../stores/dataset-store";

export function DatasetToolbar() {

    const {

        search,

        setSearch,

        openCreateDialog,

    } = useDatasetStore();

    return (

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <Input
                placeholder="Search datasets..."
                value={search}
                onChange={(event) =>
                    setSearch(
                        event.target.value
                    )
                }
                className="max-w-md"
            />

            <Button
                onClick={openCreateDialog}
            >
                New Dataset
            </Button>

        </div>

    );

}