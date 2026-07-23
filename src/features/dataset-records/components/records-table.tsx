"use client";

import { useRouter } from "next/navigation";

import {
    DatasetRecord,
} from "../types/dataset-record";

import {
    RecordActions,
} from "./record-actions";

interface Props {

    records: DatasetRecord[];

    onEdit(
        recordId: number,
    ): void;

    onDelete(
        recordId: number,
    ): void;

}

export function RecordsTable({

    records,

    onEdit,

    onDelete,

}: Props) {

    const router =
        useRouter();

    if (

        records.length === 0

    ) {

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

                    No records found

                </h3>

                <p
                    className="
                        mt-2
                        text-gray-500
                    "
                >

                    Upload records to start building your dataset.

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

                        <th className="p-3 text-left">
                            ID
                        </th>

                        <th className="p-3 text-left">
                            External ID
                        </th>

                        <th className="p-3 text-left">
                            Input
                        </th>

                        <th className="p-3 text-left">
                            Output
                        </th>

                        <th className="p-3 text-left">
                            Status
                        </th>

                        <th className="p-3 text-left">
                            Created
                        </th>

                        <th className="p-3 text-left">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        records.map(

                            (

                                record,

                            ) => (

                                <tr

                                    key={

                                        record.id

                                    }

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

                                                `/admin/dataset-records/${record.id}`

                                            )

                                        }

                                    >

                                        {record.id}

                                    </td>

                                    <td className="p-3">

                                        {

                                            record.external_id

                                            ??

                                            "-"

                                        }

                                    </td>

                                    <td className="p-3">

                                        <div
                                            className="
                                                max-w-md
                                                truncate
                                            "
                                        >

                                            {

                                                record.input

                                            }

                                        </div>

                                    </td>

                                    <td className="p-3">

                                        <div
                                            className="
                                                max-w-md
                                                truncate
                                            "
                                        >

                                            {

                                                record.output

                                            }

                                        </div>

                                    </td>

                                    <td className="p-3">

                                        {

                                            record.status

                                        }

                                    </td>

                                    <td className="p-3">

                                        {

                                            new Date(

                                                record.created_at,

                                            ).toLocaleDateString()

                                        }

                                    </td>

                                    <td className="p-3">

                                        <RecordActions

                                            recordId={

                                                record.id

                                            }

                                            onView={(id) =>

                                                router.push(

                                                    `/admin/dataset-records/${id}`

                                                )

                                            }

                                            onEdit={

                                                onEdit

                                            }

                                            onDelete={

                                                onDelete

                                            }

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