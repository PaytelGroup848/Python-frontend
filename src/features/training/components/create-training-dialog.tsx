"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Button,
} from "@/components/ui/button";

import {
    Label,
} from "@/components/ui/label";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    CreateTrainingJobRequest,
} from "../types/training";

import {
    useCreateTrainingJob,
} from "../hooks/use-create-training-job";

import {
    useTrainingConfigurations,
} from "../hooks/use-training-configurations";

import {
    useDatasets,
} from "@/features/datasets/hooks/use-datasets";

import {
    useDatasetSnapshots,
} from "@/features/datasets/hooks/use-dataset-snapshots";

import {
    useModels,
} from "@/features/models/hooks/use-models";

import {
    useModelVersions,
} from "@/features/models/hooks/use-model-versions";

import {
    useTrainingProviders,
} from "@/features/training-providers/hooks/use-training-providers";

import {
    useTokenizers,
} from "@/features/tokenizers/hooks/use-tokenizers";

import {
    useTokenizerVersions,
} from "@/features/tokenizers/hooks/use-tokenizer-versions";

interface CreateTrainingDialogProps {

    open: boolean;

    onOpenChange: (
        open: boolean,
    ) => void;

}

const DEFAULT_FORM: CreateTrainingJobRequest = {

    dataset_id: 0,

    dataset_snapshot_id: 0,

    training_provider_id: 0,

    training_configuration_id: 0,

    base_model_id: 0,

    base_model_version_id: 0,

    tokenizer_version_id: null,

    training_type: "",

    priority: 1,

    created_by: "",

};

export function CreateTrainingDialog({

    open,

    onOpenChange,

}: CreateTrainingDialogProps) {

    const [

        form,

        setForm,

    ] = useState<CreateTrainingJobRequest>({

        ...DEFAULT_FORM,

    });

    const createMutation =
        useCreateTrainingJob();

    const datasets =
        useDatasets();

    const snapshots =
        useDatasetSnapshots(
            form.dataset_id || undefined,
        );

    const providers =
        useTrainingProviders();

    const configurations =
        useTrainingConfigurations();

    const models =
        useModels();

    const modelVersions =
        useModelVersions(
            form.base_model_id || undefined,
        );

    const tokenizers =
        useTokenizers();

    const tokenizerVersions =
        useTokenizerVersions(
            form.tokenizer_version_id ??
            undefined,
        );

    const rawDatasets: any = datasets.data;
    const rawSnapshots: any = snapshots.data;
    const rawProviders: any = providers.data;
    const rawConfigs: any = configurations.data;
    const rawModels: any = models.data;
    const rawModelVersions: any = modelVersions.data;
    const rawTokenizers: any = tokenizers.data;
    const rawTokenizerVersions: any = tokenizerVersions.data;

    const datasetList: any[] = Array.isArray(rawDatasets) ? rawDatasets : (rawDatasets?.items ?? []);
    const snapshotList: any[] = Array.isArray(rawSnapshots) ? rawSnapshots : (rawSnapshots?.items ?? []);
    const providerList: any[] = Array.isArray(rawProviders) ? rawProviders : (rawProviders?.items ?? []);
    const configList: any[] = Array.isArray(rawConfigs) ? rawConfigs : (rawConfigs?.items ?? []);
    const modelList: any[] = Array.isArray(rawModels) ? rawModels : (rawModels?.items ?? []);
    const modelVersionList: any[] = Array.isArray(rawModelVersions) ? rawModelVersions : (rawModelVersions?.items ?? []);
    const tokenizerList: any[] = Array.isArray(rawTokenizers) ? rawTokenizers : (rawTokenizers?.items ?? []);
    const tokenizerVersionList: any[] = Array.isArray(rawTokenizerVersions) ? rawTokenizerVersions : (rawTokenizerVersions?.items ?? []);


    useEffect(() => {

        if (!open) {

            setForm({

                ...DEFAULT_FORM,

            });

        }

    }, [open]);

    const updateField = <
        K extends keyof CreateTrainingJobRequest
    >(
        key: K,
        value: CreateTrainingJobRequest[K],
    ) => {

        setForm(previous => ({

            ...previous,

            [key]: value,

        }));

    };

    const isValid = useMemo(() => {

        return (

            form.dataset_id > 0 &&

            form.dataset_snapshot_id > 0 &&

            form.training_provider_id > 0 &&

            form.training_configuration_id > 0 &&

            form.base_model_id > 0 &&

            form.base_model_version_id > 0 &&

            form.training_type.trim().length > 0

        );

    }, [form]);

    const handleCreate =
        async () => {

            await createMutation.mutateAsync(
                form,
            );

            onOpenChange(false);

        };

    return (

        <Dialog

            open={open}

            onOpenChange={onOpenChange}

        >

            <DialogContent className="max-w-5xl">

                <DialogHeader>

                    <DialogTitle>

                        Create Training Job

                    </DialogTitle>

                    <DialogDescription>

                        Configure a new
                        training job.

                    </DialogDescription>

                </DialogHeader>

                <Card>

                    <CardContent className="pt-6">

                        <div className="grid grid-cols-2 gap-6">

                            <div className="space-y-2">

                                <Label>

                                    Dataset

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    value={form.dataset_id}

                                    onChange={(event) => {

                                        updateField(
                                            "dataset_id",
                                            Number(
                                                event.target.value,
                                            ),
                                        );

                                        updateField(
                                            "dataset_snapshot_id",
                                            0,
                                        );

                                    }}

                                >

                                    <option value={0}>

                                        Select Dataset

                                    </option>

                                    {datasetList.map(

                                        dataset => (

                                            <option

                                                key={dataset.id}

                                                value={dataset.id}

                                            >

                                                {dataset.name}

                                            </option>

                                        ),

                                    )}

                                </select>

                            </div>

                            <div className="space-y-2">

                                <Label>

                                    Dataset Snapshot

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    disabled={
                                        !form.dataset_id
                                    }

                                    value={
                                        form.dataset_snapshot_id
                                    }

                                    onChange={(event) =>

                                        updateField(

                                            "dataset_snapshot_id",

                                            Number(
                                                event.target.value,
                                            ),

                                        )

                                    }

                                >

                                    <option value={0}>

                                        Select Snapshot

                                    </option>

                                    {snapshotList.map(

                                        snapshot => (

                                            <option

                                                key={snapshot.id}

                                                value={snapshot.id}

                                            >

                                                {snapshot.snapshot_code}

                                            </option>

                                        ),

                                    )}

                                </select>

                            </div>

                                                        <div className="space-y-2">

                                <Label>

                                    Training Provider

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    value={form.training_provider_id}

                                    onChange={(event) =>

                                        updateField(
                                            "training_provider_id",
                                            Number(event.target.value),
                                        )

                                    }

                                >

                                    <option value={0}>

                                        Select Training Provider

                                    </option>

                                    {providerList.map(
                                        (provider) => (

                                            <option
                                                key={provider.id}
                                                value={provider.id}
                                            >

                                                {provider.display_name}

                                            </option>

                                        ),
                                    )}

                                </select>

                            </div>

                            <div className="space-y-2">

                                <Label>

                                    Training Configuration

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    value={
                                        form.training_configuration_id
                                    }

                                    onChange={(event) =>

                                        updateField(
                                            "training_configuration_id",
                                            Number(event.target.value),
                                        )

                                    }

                                >

                                    <option value={0}>

                                        Select Configuration

                                    </option>

                                    {configList.map(
                                        (configuration) => (

                                            <option
                                                key={configuration.id}
                                                value={configuration.id}
                                            >

                                                {configuration.display_name}

                                            </option>

                                        ),
                                    )}

                                </select>

                            </div>

                            <div className="space-y-2">

                                <Label>

                                    Base Model

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    disabled={models.isLoading}

                                    value={form.base_model_id}

                                    onChange={(event) => {

                                        updateField(
                                            "base_model_id",
                                            Number(event.target.value),
                                        );

                                        updateField(
                                            "base_model_version_id",
                                            0,
                                        );

                                    }}

                                >

                                    <option value={0}>

                                        Select Base Model

                                    </option>

                                    {modelList.map(model => (

                                            <option
                                                key={model.id}
                                                value={model.id}
                                            >

                                                {model.display_name}

                                            </option>

                                        ),
                                    )}

                                </select>

                            </div>

                            <div className="space-y-2">

                                <Label>

                                    Base Model Version

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    disabled={
                                        !form.base_model_id
                                    }

                                    value={
                                        form.base_model_version_id
                                    }

                                    onChange={(event) =>

                                        updateField(
                                            "base_model_version_id",
                                            Number(event.target.value),
                                        )

                                    }

                                >

                                    <option value={0}>

                                        Select Version

                                    </option>

                                    {modelVersionList.map(
                                        (version) => (

                                            <option
                                                key={version.id}
                                                value={version.id}
                                            >

                                                {version.version}

                                            </option>

                                        ),
                                    )}

                                </select>

                            </div>

                            <div className="space-y-2">

                                <Label>

                                    Tokenizer

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    value={
                                        form.tokenizer_version_id ?? 0
                                    }

                                    onChange={(event) =>

                                        updateField(
                                            "tokenizer_version_id",
                                            Number(event.target.value),
                                        )

                                    }

                                >

                                    <option value={0}>

                                        Select Tokenizer

                                    </option>

                                    {tokenizerList.map(
                                        (tokenizer) => (

                                            <option
                                                key={tokenizer.id}
                                                value={tokenizer.id}
                                            >

                                                {tokenizer.display_name}

                                            </option>

                                        ),
                                    )}

                                </select>

                            </div>

                            <div className="space-y-2">

                                <Label>

                                    Tokenizer Version

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    disabled={
                                        !form.tokenizer_version_id
                                    }

                                >

                                    <option value={0}>

                                        Latest

                                    </option>

                                    {tokenizerVersionList.map(
                                        (version) => (

                                            <option
                                                key={version.id}
                                                value={version.id}
                                            >

                                                {version.version}

                                            </option>

                                        ),
                                    )}

                                </select>

                            </div>

                            <div className="space-y-2">

                                <Label>

                                    Training Type

                                </Label>

                                <select

                                    className="w-full rounded-md border px-3 py-2"

                                    value={form.training_type}

                                    onChange={(event) =>

                                        updateField(
                                            "training_type",
                                            event.target.value,
                                        )

                                    }

                                >

                                    <option value="">

                                        Select Training Type

                                    </option>

                                    <option value="SFT">

                                        Supervised Fine Tuning

                                    </option>

                                    <option value="DPO">

                                        Direct Preference Optimization

                                    </option>

                                    <option value="CONTINUED_PRETRAINING">

                                        Continued Pretraining

                                    </option>

                                </select>

                            </div>

                            <div className="space-y-2">

                                <Label>

                                    Priority

                                </Label>

                                <input

                                    type="number"

                                    min={1}

                                    className="w-full rounded-md border px-3 py-2"

                                    value={form.priority}

                                    onChange={(event) =>

                                        updateField(
                                            "priority",
                                            Number(event.target.value),
                                        )

                                    }

                                />

                            </div>

                        </div>

                    </CardContent>

                </Card>

                <div className="flex justify-end gap-2">

                    <Button

                        variant="outline"

                        onClick={() =>
                            onOpenChange(false)
                        }

                    >

                        Cancel

                    </Button>

                    <Button

                        onClick={handleCreate}

                        disabled={
                            !isValid ||
                            createMutation.isPending
                        }

                    >

                        {createMutation.isPending
                            ? "Creating..."
                            : "Create Job"}

                    </Button>

                </div>

            </DialogContent>

        </Dialog>

    );

}