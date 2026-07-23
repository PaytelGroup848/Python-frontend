"use client";

import { useMemo, useState } from "react";

import { useParams } from "next/navigation";

import {

    RecordsToolbar,

    RecordsTable,

    RecordPagination,

    UploadRecordsDialog,

    EditRecordDialog,

    DeleteRecordDialog,

} from "@/features/dataset-records/components";

import {

    useRecords,

    useUpdateRecord,

    useDeleteRecord,

    useImportRecords,

} from "@/features/dataset-records/hooks";

import {

    DatasetRecord,

    DatasetRecordQueryParams,

    UpdateDatasetRecordRequest,

} from "@/features/dataset-records/types/dataset-record";

export default function DatasetRecordsPage() {

    const params = useParams();

    const datasetId = Number(

        params.datasetId,

    );

    const [

        query,

        setQuery,

    ] = useState<DatasetRecordQueryParams>({

        dataset_id: datasetId,

    });

    const {

        data,

        isLoading,

        error,

        refetch,

    } = useRecords(

        query,

    );


    const updateRecord =
        useUpdateRecord();

    const deleteRecord =
        useDeleteRecord();

    const importRecords =
        useImportRecords();

    const [

        selectedRecord,

        setSelectedRecord,

    ] = useState<DatasetRecord | null>(

        null,

    );

    const [

        uploadOpen,

        setUploadOpen,

    ] = useState(false);

    const [

        editOpen,

        setEditOpen,

    ] = useState(false);

    const [

        deleteOpen,

        setDeleteOpen,

    ] = useState(false);

    const records =
        data?.items ?? [];

    const pages = useMemo(

        () =>

            Array.from(

                {

                    length:

                        data?.total_pages ?? 0,

                },

                (_, index) =>

                    index + 1,

            ),

        [

            data?.total_pages,

        ],

    );

    if (

        isLoading

    ) {

        return (

            <div className="p-6">

                Loading records...

            </div>

        );

    }

    if (

        error

    ) {

        return (

            <div className="p-6">

                Failed to load records.

            </div>

        );

    }

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">

                Dataset Records

            </h1>

            <RecordsToolbar

                search={

                    query.search ?? ""

                }

                status={

                    query.status ?? ""

                }

                onSearchChange={(value: string) =>

                    setQuery(

                        (previous) => ({

                            ...previous,

                            search:

                                value ||

                                undefined,

                            page:

                                undefined,

                        }),

                    )

                }

                onStatusChange={(value: string) =>

                    setQuery(

                        (previous) => ({

                            ...previous,

                            status:

                                value ||

                                undefined,

                            page:

                                undefined,

                        }),

                    )

                }

                onRefresh={

                    refetch

                }

                onUploadRecords={() =>

                    setUploadOpen(

                        true,

                    )

                }

            />

            <RecordsTable

                records={

                    records

                }

                onEdit={(id: number) => {

                    const record =

                        records.find(

                            (

                                item,

                            ) =>

                                item.id === id,

                        );

                    if (

                        record

                    ) {

                        setSelectedRecord(

                            record,

                        );

                        setEditOpen(

                            true,

                        );

                    }

                }}

                onDelete={(id: number) => {

                    const record =

                        records.find(

                            (

                                item,

                            ) =>

                                item.id === id,

                        );

                    if (

                        record

                    ) {

                        setSelectedRecord(

                            record,

                        );

                        setDeleteOpen(

                            true,

                        );

                    }

                }}

            />

            <RecordPagination

                page={

                    data?.page ?? 1

                }

                totalPages={

                    data?.total_pages ?? 1

                }

                pages={

                    pages

                }

                onPrevious={() =>

                    setQuery(

                        (previous) => ({

                            ...previous,

                            page:

                                Math.max(

                                    1,

                                    (

                                        data?.page ??

                                        1

                                    ) - 1,

                                ),

                        }),

                    )

                }

                onNext={() =>

                    setQuery(

                        (previous) => ({

                            ...previous,

                            page:

                                Math.min(

                                    data?.total_pages ??

                                        1,

                                    (

                                        data?.page ??

                                        1

                                    ) + 1,

                                ),

                        }),

                    )

                }

                onPageChange={(page: number) =>

                    setQuery(

                        (previous) => ({

                            ...previous,

                            page,

                        }),

                    )

                }

            />

            <UploadRecordsDialog

                open={

                    uploadOpen

                }

                onClose={() =>

                    setUploadOpen(

                        false,

                    )

                }

                onUpload={(file: File) =>

                    importRecords.mutateAsync({

                        datasetId,

                        file,

                    })

                }

            />

            <EditRecordDialog

                open={

                    editOpen

                }

                record={

                    selectedRecord

                }

                onClose={() =>

                    setEditOpen(

                        false,

                    )

                }

                onSubmit={

                    async (

                        request: UpdateDatasetRecordRequest,

                    ) => {

                        if (

                            !selectedRecord

                        ) {

                            return;

                        }

                        await updateRecord.mutateAsync({

                            recordId:

                                selectedRecord.id,

                            request,

                        });

                        setEditOpen(false);

                    }

                }

            />

            <DeleteRecordDialog

                open={

                    deleteOpen

                }

                recordId={

                    selectedRecord?.id ??

                    null

                }

                onClose={() =>

                    setDeleteOpen(

                        false,

                    )

                }

                onDelete={

                    async () => {

                        if (

                            !selectedRecord

                        ) {

                            return;

                        }

                        await deleteRecord.mutateAsync(

                            selectedRecord.id,

                        );

                        setDeleteOpen(false);

                    }

                }

            />

        </div>

    );

}