import { create } from "zustand";

interface PlaygroundState {

    activeAssistantId:
        number | null;

    setActiveAssistantId(
        id: number | null
    ): void;

}

export const
usePlaygroundStore =
create<PlaygroundState>(

    (set) => ({

        activeAssistantId:
            null,

        setActiveAssistantId:
            (id) =>

                set({

                    activeAssistantId:
                        id,

                }),

    }),

);