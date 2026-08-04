import { create } from "zustand";

interface DatasetStore {

    selectedDatasetId: number | null;

    search: string;

    statusFilter: string;

    domainFilter: string;

    corpusFilter: string;

    isCreateDialogOpen: boolean;

    isDeleteDialogOpen: boolean;

    isEditDialogOpen: boolean;

    setSelectedDataset(
        datasetId: number | null,
    ): void;

    setSearch(
        search: string,
    ): void;

    setStatusFilter(
        status: string,
    ): void;

    setDomainFilter(
        domain: string,
    ): void;

    setCorpusFilter(
        corpus: string,
    ): void;

    openCreateDialog(): void;

    closeCreateDialog(): void;

    openEditDialog(): void;

    closeEditDialog(): void;

    openDeleteDialog(): void;

    closeDeleteDialog(): void;

    resetFilters(): void;

}

export const useDatasetStore = create<DatasetStore>(

    (set) => ({

        selectedDatasetId: null,

        search: "",

        statusFilter: "",

        domainFilter: "",

        corpusFilter: "",

        isCreateDialogOpen: false,

        isDeleteDialogOpen: false,

        isEditDialogOpen: false,

        setSelectedDataset: (datasetId) =>

            set({

                selectedDatasetId: datasetId,

            }),

        setSearch: (search) =>

            set({

                search,

            }),

        setStatusFilter: (status) =>

            set({

                statusFilter: status,

            }),

        setDomainFilter: (domain) =>

            set({

                domainFilter: domain,

            }),

        setCorpusFilter: (corpus) =>

            set({

                corpusFilter: corpus,

            }),

        

        openCreateDialog: () =>

            set({

                isCreateDialogOpen: true,

            }),

        closeCreateDialog: () =>

            set({

                isCreateDialogOpen: false,

            }),

        openEditDialog: () =>

            set({

                isEditDialogOpen: true,

            }),

        closeEditDialog: () =>

            set({

                isEditDialogOpen: false,

            }),

        openDeleteDialog: () =>

            set({

                isDeleteDialogOpen: true,

            }),

        closeDeleteDialog: () =>

            set({

                isDeleteDialogOpen: false,

            }),

        resetFilters: () =>
            set({

                search: "",

                statusFilter: "",

                domainFilter: "",

                corpusFilter: "",

                selectedDatasetId: null,

            }),

    })

);