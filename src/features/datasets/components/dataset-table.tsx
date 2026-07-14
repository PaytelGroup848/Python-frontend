"use client";

import { useRouter } from "next/navigation";


import { Dataset } from "../types/dataset";

import { DatasetStatusBadge } from "./dataset-status-badge";

import { DatasetActions } from "./dataset-actions";

interface Props {

    datasets: Dataset[];

    onEdit: (
        datasetId: number,
    ) => void;

    onDelete: (
        datasetId: number,
    ) => void;

}

export function DatasetTable({

    datasets,

    onEdit,

    onDelete,

}: Props) {

    const router =
        useRouter();

    if (datasets.length === 0) {

        return (

            <div
                className="
                    rounded-xl
                    border
                    p-10
                    text-center
                "
            >

                <h3
                    className="
                        text-lg
                        font-semibold
                    "
                >
                    No datasets found
                </h3>

                <p
                    className="
                        mt-2
                        text-gray-500
                    "
                >
                    Create your first dataset to begin training your own model.
                </p>

            </div>

        );

    }

    return (

        <div
            className="
                overflow-x-auto
                rounded-xl
                border
            "
        >

            <table
                className="
                    min-w-full
                "
            >

                <thead>

                    <tr>

                        <th className="p-3 text-left">Name</th>

                        <th className="p-3 text-left">Corpus</th>

                        <th className="p-3 text-left">Domain</th>

                        <th className="p-3 text-left">Version</th>

                        <th className="p-3 text-left">Records</th>

                        <th className="p-3 text-left">Snapshots</th>

                        <th className="p-3 text-left">Status</th>

                        <th className="p-3 text-left">Created</th>

                        <th className="p-3 text-left">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        datasets.map(

                            (dataset) => (

                                <tr

                                    key={dataset.id}

                                    className="
                                        border-t
                                        hover:bg-gray-50
                                        cursor-pointer
                                    "

                                >

                                    <td
                                        className="p-3"

                                        onClick={() =>

                                            router.push(

                                                `/admin/datasets/${dataset.id}`

                                            )

                                        }

                                    >
                                        {dataset.name}
                                    </td>

                                    <td className="p-3">
                                        {dataset.corpus_name ?? "-"}
                                    </td>

                                    <td className="p-3">
                                        {dataset.domain}
                                    </td>

                                    <td className="p-3">
                                        {dataset.version}
                                    </td>

                                    <td className="p-3">
                                        {dataset.record_count}
                                    </td>

                                    <td className="p-3">
                                        {dataset.snapshot_count ?? 0}
                                    </td>

                                    <td className="p-3">

                                        <DatasetStatusBadge
                                            status={dataset.status}
                                        />

                                    </td>

                                    <td className="p-3">
                                        {new Date(
                                            dataset.created_at
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-3">

                                        <DatasetActions

                                            datasetId={dataset.id}

                                            onView={(id)=>

                                                router.push(

                                                    `/admin/datasets/${id}`

                                                )

                                            }

                                            onEdit={onEdit}

                                            onUpload={(id) =>

                                                router.push(

                                                    `/admin/datasets/${id}/records`

                                                )

                                            }

                                            onSnapshot={(id) =>

                                                router.push(

                                                    `/admin/datasets/${id}/snapshots`

                                                )

                                            }

                                            onDelete={onDelete}

                                        />

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}