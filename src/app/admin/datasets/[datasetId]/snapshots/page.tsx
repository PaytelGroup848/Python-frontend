"use client";

import { useParams } from "next/navigation";
import { useDatasetSnapshots } from "@/features/datasets/hooks/use-dataset-snapshots";

export default function DatasetSnapshotsPage() {

    const params = useParams();

    const datasetId = Number(params.datasetId);

    const { data: snapshots, isLoading, error, refetch } = useDatasetSnapshots(datasetId);

    const snapshotList = Array.isArray(snapshots) ? snapshots : ((snapshots as any)?.items ?? []);

    return (

        <div className="space-y-6 p-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Dataset Snapshots
                    </h1>
                    <p className="text-muted-foreground">
                        Snapshots for Dataset ID: {datasetId}
                    </p>
                </div>

                <button
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                    onClick={() => refetch()}
                >
                    Refresh
                </button>
            </div>

            {isLoading ? (
                <div className="rounded-lg border p-8 text-center">
                    Loading snapshots...
                </div>
            ) : error ? (
                <div className="rounded-lg border p-8 text-center text-red-500">
                    Failed to load snapshots.
                </div>
            ) : snapshotList.length === 0 ? (
                <div className="rounded-lg border p-10 text-center">
                    <h3 className="text-lg font-semibold">No Snapshots Found</h3>
                    <p className="mt-2 text-gray-500">
                        Upload dataset records to generate immutable snapshots for training.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Snapshot Code</th>
                                <th className="p-3 text-left">Records</th>
                                <th className="p-3 text-left">Immutable</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {snapshotList.map((snapshot: any) => (
                                <tr key={snapshot.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{snapshot.id}</td>
                                    <td className="p-3 font-mono text-sm">{snapshot.snapshot_code}</td>
                                    <td className="p-3">{snapshot.record_count}</td>
                                    <td className="p-3">
                                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${snapshot.is_immutable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {snapshot.is_immutable ? 'SEALED (IMMUTABLE)' : 'DRAFT'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                            {snapshot.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {new Date(snapshot.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>

    );

}