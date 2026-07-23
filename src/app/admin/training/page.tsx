"use client";

import { useMemo, useState } from "react";

import {
    TrainingTable,
    TrainingToolbar,
} from "@/features/training/components";

import { useTrainingJobs } from "@/features/training/hooks/use-training-jobs";
import { useDispatchTrainingJob } from "@/features/training/hooks/use-dispatch-training-job";
import { useDeleteTrainingJob } from "@/features/training/hooks/use-delete-training-job";

export default function TrainingPage() {

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const query = useMemo(
        () => ({
            page: 1,
            page_size: 20,
            search,
            status,
        }),
        [search, status],
    );

    const {
        data,
        isLoading,
        refetch,
    } = useTrainingJobs(query);

    const dispatchMutation =
        useDispatchTrainingJob();

    const deleteMutation =
        useDeleteTrainingJob();

    return (

        <div className="space-y-6 p-6">

            <div>

                <h1 className="text-3xl font-bold">

                    Training Dashboard

                </h1>

                <p className="text-muted-foreground">

                    Manage training jobs

                </p>

            </div>

            <TrainingToolbar

                search={search}

                status={status}

                onSearchChange={setSearch}

                onStatusChange={setStatus}

                onRefresh={() => refetch()}

                onCreateTraining={() => {

                    alert(
                        "Create Training Dialog will be added next.",
                    );

                }}

            />

            {isLoading ? (

                <div className="rounded-lg border p-8">

                    Loading...

                </div>

            ) : (

                <TrainingTable
                    trainingJobs={data?.items ?? []}
                    onView={(id) => {
                        console.log("View", id);
                    }}
                    onDispatch={(id) => {
                        dispatchMutation.mutate(id);
                    }}
                    onDelete={(id) => {
                        if (window.confirm("Delete this training job?")) {
                            deleteMutation.mutate(id);
                        }
                    }}
                />
            )}
        </div>
    );
}