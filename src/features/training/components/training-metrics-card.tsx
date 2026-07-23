"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    TrainingMetrics,
} from "../types/training";

interface TrainingMetricsCardProps {

    metrics: TrainingMetrics;

}

function formatNumber(
    value: number | null,
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "-";

    }

    return value.toLocaleString();

}

function formatFloat(
    value: number | null,
    digits = 6,
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "-";

    }

    return value.toFixed(
        digits,
    );

}

export function TrainingMetricsCard({

    metrics,

}: TrainingMetricsCardProps) {

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Training Metrics

                </CardTitle>

            </CardHeader>

            <CardContent>

                <div
                    className="
                        grid
                        grid-cols-2
                        gap-4
                        md:grid-cols-3
                    "
                >

                    <MetricItem

                        label="Epoch"

                        value={
                            metrics.current_epoch
                        }

                    />

                    <MetricItem

                        label="Step"

                        value={
                            metrics.current_step
                        }

                    />

                    <MetricItem

                        label="Global Step"

                        value={
                            metrics.global_step
                        }

                    />

                    <MetricItem

                        label="Samples"

                        value={

                            formatNumber(

                                metrics.processed_samples,

                            )

                        }

                    />

                    <MetricItem

                        label="Tokens"

                        value={

                            formatNumber(

                                metrics.processed_tokens,

                            )

                        }

                    />

                    <MetricItem

                        label="Loss"

                        value={

                            formatFloat(

                                metrics.current_loss,

                            )

                        }

                    />

                    <MetricItem

                        label="Learning Rate"

                        value={

                            formatFloat(

                                metrics.learning_rate,

                                8,

                            )

                        }

                    />

                </div>

            </CardContent>

        </Card>

    );

}

interface MetricItemProps {

    label: string;

    value: string | number;

}

function MetricItem({

    label,

    value,

}: MetricItemProps) {

    return (

        <div
            className="
                rounded-lg
                border
                p-4
            "
        >

            <div
                className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-muted-foreground
                "
            >

                {label}

            </div>

            <div
                className="
                    mt-2
                    text-lg
                    font-semibold
                "
            >

                {value}

            </div>

        </div>

    );

}