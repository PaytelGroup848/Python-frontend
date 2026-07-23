"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface TrainingLogViewerProps {

    logs: string[];

    isLoading?: boolean;

}

export function TrainingLogViewer({

    logs,

    isLoading = false,

}: TrainingLogViewerProps) {

    if (isLoading) {

        return (

            <Card>

                <CardHeader>

                    <CardTitle>

                        Training Logs

                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <div className="text-sm text-muted-foreground">

                        Loading logs...

                    </div>

                </CardContent>

            </Card>

        );

    }

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Training Logs

                </CardTitle>

            </CardHeader>

            <CardContent>

                {logs.length === 0 ? (

                    <div className="text-sm text-muted-foreground">

                        No logs available.

                    </div>

                ) : (

                    <div
                        className="
                            max-h-[400px]
                            overflow-y-auto
                            rounded-lg
                            border
                            bg-black
                            p-4
                            font-mono
                            text-xs
                            text-green-400
                        "
                    >

                        {logs.map(

                            (
                                log,
                                index,
                            ) => (

                                <div
                                    key={index}
                                    className="mb-1 whitespace-pre-wrap break-words"
                                >

                                    {log}

                                </div>

                            ),

                        )}

                    </div>

                )}

            </CardContent>

        </Card>

    );

}