"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {

    DatasetToolbar,

    DatasetTable,

    CreateDatasetDialog,

    EditDatasetDialog,

    DeleteDatasetDialog,

} from "@/features/datasets/components";

import {

    useDatasets,

    useCreateDataset,

    useUpdateDataset,

    useDeleteDataset,

} from "@/features/datasets/hooks";

import {

    useDatasetStore,

} from "@/features/datasets/stores/dataset-store";



import {
    DatasetQueryParams,
} from "@/features/datasets/types/dataset";

import {
    DatasetPagination,
} from "@/features/datasets/components";


function DatasetsContent() {

   

    const searchParams = useSearchParams();

    const router = useRouter();

    const pathname = usePathname();

    function updateQuery(
        changes: Partial<DatasetQueryParams>,
    ) {

        const params = new URLSearchParams(
            searchParams.toString(),
        );

        Object.entries(changes).forEach(
            ([key, value]) => {
 
                if (
                    value === undefined ||
                    value === ""
                ) {

                    params.delete(key);

                } else {

                    params.set(
                        key,
                        String(value),
                    );

                }

            },
        );

        router.replace(
            `${pathname}?${params.toString()}`
        );

    }

    const query: DatasetQueryParams = {

        page: searchParams.get("page")
            ? Number(searchParams.get("page"))
            : undefined,

        page_size: searchParams.get("page_size")
            ? Number(searchParams.get("page_size"))
            : undefined,

        search: searchParams.get("search") ?? undefined,

        domain: searchParams.get("domain") ?? undefined,

        status: searchParams.get("status") ?? undefined,

        sort: searchParams.get("sort") ?? undefined,

        direction:
            (searchParams.get("direction") as "asc" | "desc" | null) ?? undefined,

    };

    const {

        data,

        isLoading,

        error,

        refetch,

    } = useDatasets(

        query,

    );

    const datasets =
        data?.items ?? [];

    const createDataset =
        useCreateDataset();

    const updateDataset =
        useUpdateDataset();

    const deleteDataset =
        useDeleteDataset();

    const {

        isCreateDialogOpen,

        isEditDialogOpen,

        isDeleteDialogOpen,

        closeCreateDialog,

        closeEditDialog,

        closeDeleteDialog,

        selectedDatasetId,

    } = useDatasetStore();

    const selectedDataset =

        datasets.find(

            (dataset) =>

                dataset.id ===

                selectedDatasetId

        );

    if (isLoading) {

        return (

            <div className="p-6">

                Loading datasets...

            </div>

        );

    }

    if (error) {

        return (

            <div className="p-6">

                Failed to load datasets.

            </div>

        );

    }

    return (

        <div className="space-y-6 p-6">

            <h1
                className="
                    text-3xl
                    font-bold
                "
            >
                Dataset Management
            </h1>

            <DatasetToolbar

                search={

                    query.search ?? ""

                }

                domain={

                    query.domain ?? ""

                }

                status={

                    query.status ?? ""

                }

                corpus={
                    ""
                }

                onSearchChange={(value) =>

                    updateQuery({

                        search:

                            value || undefined,

                        page:

                            undefined,

                    })

                }

                onDomainChange={(value) =>

                    updateQuery({

                        domain:

                            value || undefined,

                        page:

                            undefined,

                    })

                }

                onStatusChange={(value) =>

                    updateQuery({

                        status:

                            value || undefined,

                        page:

                            undefined,

                    })

                }

                onCorpusChange={() => {

                }}

                onRefresh={

                    refetch

                }

                onCreateDataset={() => {

                    useDatasetStore
                        .getState()
                        .openCreateDialog();

                }}

            />

            <DatasetTable

                datasets={datasets}

                onEdit={(datasetId) => {

                    useDatasetStore
                        .getState()
                        .setSelectedDataset(
                            datasetId,
                        );

                    useDatasetStore
                        .getState()
                        .openEditDialog();

                }}

                onDelete={(datasetId) => {

                    useDatasetStore
                        .getState()
                        .setSelectedDataset(
                            datasetId,
                        );

                    useDatasetStore
                        .getState()
                        .openDeleteDialog();

                }}

            />

            <DatasetPagination

                page={

                    data?.page ?? 1

                }

                totalPages={

                    data?.total_pages ?? 1

                }

                pages={

                    []

                }

                onPrevious={() => {

                    if (

                        !data ||

                        data.page <= 1

                    ) {

                        return;

                    }

                    updateQuery({

                        page:

                            data.page - 1,

                    });

                }}

                onNext={() => {

                    if (

                        !data ||

                        data.page >= data.total_pages

                    ) {

                        return;

                    }

                    updateQuery({

                        page:

                        data.page + 1,

                    });

                }}

                onPageChange={(page) =>

                    updateQuery({

                        page,

                    })

                }

            />

            <CreateDatasetDialog

                open={isCreateDialogOpen}

                onClose={closeCreateDialog}

                onSubmit={async (payload) => {

                    await createDataset.mutateAsync(
                        payload,
                    );

                }}

            />

            <EditDatasetDialog

                open={isEditDialogOpen}

                dataset={selectedDataset ?? null}

                onClose={closeEditDialog}

                onSubmit={async (payload) => {

                    if (
                        selectedDatasetId === null
                    ) {

                        return;

                    }

                    await updateDataset.mutateAsync({

                        datasetId:
                            selectedDatasetId,

                        request:
                            payload,

                    });

                }}

            />

            <DeleteDatasetDialog

                open={isDeleteDialogOpen}

                datasetName={
                    selectedDataset?.name
                    ??
                    ""
                }

                onClose={
                    closeDeleteDialog
                }

                onDelete={

                    async () => {

                        if (

                            selectedDatasetId

                            ==

                            null

                        ) {

                            return;

                        }

                        await deleteDataset.mutateAsync(

                            selectedDatasetId

                        );

                    }

                }

            />

        </div>

    );

}

export default function DatasetsPage() {
    return (
        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center text-sm text-slate-500">Loading datasets...</div>}>
            <DatasetsContent />
        </Suspense>
    );
}