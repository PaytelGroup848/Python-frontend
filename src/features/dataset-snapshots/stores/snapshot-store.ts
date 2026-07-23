
import { create } from "zustand";

interface SnapshotStore {

    selectedSnapshotId: number | null;

    isCreateDialogOpen: boolean;

    isDetailsDialogOpen: boolean;

    isDeleteDialogOpen: boolean;

    setSelectedSnapshot: (
        snapshotId: number | null,
    ) => void;

    openCreateDialog: () => void;

    closeCreateDialog: () => void;

    openDetailsDialog: () => void;

    closeDetailsDialog: () => void;

    openDeleteDialog: () => void;

    closeDeleteDialog: () => void;

}

export const useSnapshotStore =
    create<SnapshotStore>(

        (set) => ({

            selectedSnapshotId: null,

            isCreateDialogOpen: false,

            isDetailsDialogOpen: false,

            isDeleteDialogOpen: false,

            setSelectedSnapshot: (
                snapshotId,
            ) =>

                set({

                    selectedSnapshotId:
                        snapshotId,

                }),

            openCreateDialog: () =>

                set({

                    isCreateDialogOpen: true,

                }),

            closeCreateDialog: () =>

                set({

                    isCreateDialogOpen: false,

                }),

            openDetailsDialog: () =>

                set({

                    isDetailsDialogOpen: true,

                }),

            closeDetailsDialog: () =>

                set({

                    isDetailsDialogOpen: false,

                }),

            openDeleteDialog: () =>

                set({

                    isDeleteDialogOpen: true,

                }),

            closeDeleteDialog: () =>

                set({

                    isDeleteDialogOpen: false,

                }),

        }),

    );