"use client";

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


export default function DatasetsPage() {

    const {

        data,

        isLoading,

    } = useDatasets();

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

            <DatasetToolbar />

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