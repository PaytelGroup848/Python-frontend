"use client";


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface TrainingProgressCardProps {

    currentEpoch: number;

    totalEpochs?: number;

    currentStep: number;

    totalSteps?: number;

    processedSamples: number;

    processedTokens: number;

}

function calculatePercentage(
    current: number,
    total?: number,
) {

    if (
        !total ||
        total <= 0
    ) {

        return 0;

    }

    return Math.min(
        100,
        Math.round(
            (current / total) * 100,
        ),
    );

}

function formatNumber(
    value: number,
) {

    return value.toLocaleString();

}

function ProgressBar({
    value,
}: {
    value: number;
}) {

    return (

        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">

            <div
                className="h-full bg-primary transition-all"
                style={{
                    width: `${value}%`,
                }}
            />

        </div>

    );

}

export function TrainingProgressCard({

    currentEpoch,

    totalEpochs,

    currentStep,

    totalSteps,

    processedSamples,

    processedTokens,

}: TrainingProgressCardProps) {

    const epochProgress =
        calculatePercentage(

            currentEpoch,

            totalEpochs,

        );

    const stepProgress =
        calculatePercentage(

            currentStep,

            totalSteps,

        );

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Training Progress

                </CardTitle>

            </CardHeader>

            <CardContent className="space-y-6">

                <div className="space-y-2">

                    <div className="flex items-center justify-between">

                        <span className="text-sm font-medium">

                            Epoch

                        </span>

                        <span className="text-sm text-muted-foreground">

                            {currentEpoch}

                            {totalEpochs
                                ? ` / ${totalEpochs}`
                                : ""}

                        </span>

                    </div>

                    <ProgressBar value={epochProgress} />

                </div>

                <div className="space-y-2">

                    <div className="flex items-center justify-between">

                        <span className="text-sm font-medium">

                            Step

                        </span>

                        <span className="text-sm text-muted-foreground">

                            {currentStep}

                            {totalSteps
                                ? ` / ${totalSteps}`
                                : ""}

                        </span>

                    </div>

                    <ProgressBar value={stepProgress} />

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-lg border p-4">

                        <div className="text-xs uppercase text-muted-foreground">

                            Processed Samples

                        </div>

                        <div className="mt-2 text-xl font-semibold">

                            {formatNumber(

                                processedSamples,

                            )}

                        </div>

                    </div>

                    <div className="rounded-lg border p-4">

                        <div className="text-xs uppercase text-muted-foreground">

                            Processed Tokens

                        </div>

                        <div className="mt-2 text-xl font-semibold">

                            {formatNumber(

                                processedTokens,

                            )}

                        </div>

                    </div>

                </div>

            </CardContent>

        </Card>

    );

}