"use client";

import {
    Calendar,
    Database,
    FileArchive,
    Cpu,
    Clock,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Separator,
} from "@/components/ui/separator";

import {
    TrainingJob,
} from "../types/training";

import {
    TrainingStatusBadge,
} from "./training-status-badge";

import {
    TrainingMetricsCard,
} from "./training-metrics-card";

interface TrainingDetailsDialogProps {

    open: boolean;

    trainingJob: TrainingJob | null;

    onOpenChange: (
        open: boolean,
    ) => void;

}

function formatDate(
    value: string | null,
) {

    if (!value) {

        return "-";

    }

    return new Date(
        value,
    ).toLocaleString();

}

export function TrainingDetailsDialog({

    open,

    trainingJob,

    onOpenChange,

}: TrainingDetailsDialogProps) {

    if (!trainingJob) {

        return null;

    }

    return (

        <Dialog

            open={open}

            onOpenChange={onOpenChange}

        >

            <DialogContent

                className="max-w-5xl"

            >

                <DialogHeader>

                    <DialogTitle>

                        Training Job #

                        {trainingJob.id}

                    </DialogTitle>

                    <DialogDescription>

                        Training job information

                    </DialogDescription>

                </DialogHeader>

                <div

                    className="space-y-6"

                >

                    <Card>

                        <CardHeader>

                            <CardTitle>

                                Basic Information

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div

                                className="grid grid-cols-2 gap-6"

                            >

                                <InfoRow

                                    icon={<Database className="h-4 w-4" />}

                                    label="Dataset"

                                    value={trainingJob.dataset_id}

                                />

                                <InfoRow

                                    icon={<FileArchive className="h-4 w-4" />}

                                    label="Snapshot"

                                    value={

                                        trainingJob.dataset_snapshot_id ?? "-"

                                    }

                                />

                                <InfoRow

                                    icon={<Cpu className="h-4 w-4" />}

                                    label="Base Model"

                                    value={

                                        trainingJob.base_model_id

                                    }

                                />

                                <InfoRow

                                    icon={<Cpu className="h-4 w-4" />}

                                    label="Training Type"

                                    value={

                                        trainingJob.training_type

                                    }

                                />

                                <InfoRow

                                    icon={<Clock className="h-4 w-4" />}

                                    label="Priority"

                                    value={

                                        trainingJob.priority

                                    }

                                />

                                <div>

                                    <div

                                        className="text-sm text-muted-foreground"

                                    >

                                        Status

                                    </div>

                                    <div className="mt-2">

                                        <TrainingStatusBadge

                                            status={

                                                trainingJob.status

                                            }

                                        />

                                    </div>

                                </div>

                            </div>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader>

                            <CardTitle>

                                Timeline

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div

                                className="grid grid-cols-2 gap-6"

                            >

                                <InfoRow

                                    icon={<Calendar className="h-4 w-4" />}

                                    label="Queued"

                                    value={

                                        formatDate(

                                            trainingJob.queued_at,

                                        )

                                    }

                                />

                                <InfoRow

                                    icon={<Calendar className="h-4 w-4" />}

                                    label="Started"

                                    value={

                                        formatDate(

                                            trainingJob.started_at,

                                        )

                                    }

                                />

                                <InfoRow

                                    icon={<Calendar className="h-4 w-4" />}

                                    label="Completed"

                                    value={

                                        formatDate(

                                            trainingJob.completed_at,

                                        )

                                    }

                                />

                                <InfoRow

                                    icon={<Calendar className="h-4 w-4" />}

                                    label="Failed"

                                    value={

                                        formatDate(

                                            trainingJob.failed_at,

                                        )

                                    }

                                />

                            </div>

                        </CardContent>

                    </Card>

                    <Separator />

                    <TrainingMetricsCard

                        metrics={{

                            current_epoch:

                                trainingJob.current_epoch,

                            current_step:

                                trainingJob.current_step,

                            global_step:

                                trainingJob.global_step,

                            processed_samples:

                                trainingJob.processed_samples,

                            processed_tokens:

                                trainingJob.processed_tokens,

                            current_loss:

                                trainingJob.current_loss,

                            learning_rate:

                                trainingJob.learning_rate,

                        }}

                    />

                                        <Card>

                        <CardHeader>

                            <CardTitle>

                                Checkpoint

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="grid grid-cols-2 gap-6">

                                <InfoRow
                                    icon={<FileArchive className="h-4 w-4" />}
                                    label="Checkpoint Path"
                                    value={
                                        trainingJob.last_checkpoint_path ??
                                        "-"
                                    }
                                />

                                <InfoRow
                                    icon={<Calendar className="h-4 w-4" />}
                                    label="Checkpoint Time"
                                    value={formatDate(
                                        trainingJob.last_checkpoint_at,
                                    )}
                                />

                            </div>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader>

                            <CardTitle>

                                Artifact

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <InfoRow
                                icon={<FileArchive className="h-4 w-4" />}
                                label="Artifact Path"
                                value={
                                    trainingJob.artifact_path ??
                                    "-"
                                }
                            />

                        </CardContent>

                    </Card>

                    {trainingJob.failure_reason && (

                        <Card>

                            <CardHeader>

                                <CardTitle>

                                    Failure Reason

                                </CardTitle>

                            </CardHeader>

                            <CardContent>

                                <p className="text-sm whitespace-pre-wrap">

                                    {trainingJob.failure_reason}

                                </p>

                            </CardContent>

                        </Card>

                    )}

                    <Card>

                        <CardHeader>

                            <CardTitle>

                                Audit Information

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="grid grid-cols-2 gap-6">

                                <InfoRow
                                    icon={<Calendar className="h-4 w-4" />}
                                    label="Created At"
                                    value={formatDate(
                                        trainingJob.created_at,
                                    )}
                                />

                                <InfoRow
                                    icon={<Calendar className="h-4 w-4" />}
                                    label="Updated At"
                                    value={formatDate(
                                        trainingJob.updated_at,
                                    )}
                                />

                            </div>

                        </CardContent>

                    </Card>

                </div>

            </DialogContent>

        </Dialog>

    );

}

interface InfoRowProps {

    icon: React.ReactNode;

    label: string;

    value: React.ReactNode;

}

function InfoRow({

    icon,

    label,

    value,

}: InfoRowProps) {

    return (

        <div
            className="
                flex
                items-start
                gap-3
            "
        >

            <div
                className="
                    mt-1
                    text-muted-foreground
                "
            >

                {icon}

            </div>

            <div className="min-w-0 flex-1">

                <div
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >

                    {label}

                </div>

                <div
                    className="
                        mt-1
                        break-all
                        font-medium
                    "
                >

                    {value}

                </div>

            </div>

        </div>

    );

}