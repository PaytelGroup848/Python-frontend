
import { create } from "zustand";

interface TrainingStore {

    selectedTrainingJobId: number | null;

    isCreateDialogOpen: boolean;

    isDetailsDialogOpen: boolean;

    isDeleteDialogOpen: boolean;

    isCancelDialogOpen: boolean;

    isPauseDialogOpen: boolean;

    isResumeDialogOpen: boolean;

    isRetryDialogOpen: boolean;

    setSelectedTrainingJob: (
        trainingJobId: number | null,
    ) => void;

    openCreateDialog: () => void;

    closeCreateDialog: () => void;

    openDetailsDialog: () => void;

    closeDetailsDialog: () => void;

    openDeleteDialog: () => void;

    closeDeleteDialog: () => void;

    openCancelDialog: () => void;

    closeCancelDialog: () => void;

    openPauseDialog: () => void;

    closePauseDialog: () => void;

    openResumeDialog: () => void;

    closeResumeDialog: () => void;

    openRetryDialog: () => void;

    closeRetryDialog: () => void;

    reset: () => void;

}

const initialState = {

    selectedTrainingJobId: null,

    isCreateDialogOpen: false,

    isDetailsDialogOpen: false,

    isDeleteDialogOpen: false,

    isCancelDialogOpen: false,

    isPauseDialogOpen: false,

    isResumeDialogOpen: false,

    isRetryDialogOpen: false,

};

export const useTrainingStore =
    create<TrainingStore>(

        (set) => ({

            ...initialState,

            setSelectedTrainingJob: (
                trainingJobId,
            ) =>

                set({

                    selectedTrainingJobId:
                        trainingJobId,

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

            openCancelDialog: () =>

                set({

                    isCancelDialogOpen: true,

                }),

            closeCancelDialog: () =>

                set({

                    isCancelDialogOpen: false,

                }),

            openPauseDialog: () =>

                set({

                    isPauseDialogOpen: true,

                }),

            closePauseDialog: () =>

                set({

                    isPauseDialogOpen: false,

                }),

            openResumeDialog: () =>

                set({

                    isResumeDialogOpen: true,

                }),

            closeResumeDialog: () =>

                set({

                    isResumeDialogOpen: false,

                }),

            openRetryDialog: () =>

                set({

                    isRetryDialogOpen: true,

                }),

            closeRetryDialog: () =>

                set({

                    isRetryDialogOpen: false,

                }),

            reset: () =>

                set({

                    ...initialState,

                }),

        }),

    );