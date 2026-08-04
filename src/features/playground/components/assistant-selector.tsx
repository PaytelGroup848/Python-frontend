"use client";

import {
  useEffect,
} from "react";

import {
  useAssistants,
} from "../hooks/use-assistants";

import {
  useConversationStore,
} from "@/features/chat/stores/conversation-store";

export function AssistantSelector() {

  const {
    data: assistants = [],
    isLoading,
  } = useAssistants();

  const activeAssistantId =
    useConversationStore(
      (state) =>
        state.activeAssistantId
    );

  const setActiveAssistantId =
    useConversationStore(
      (state) =>
        state.setActiveAssistantId
    );

  useEffect(() => {

    if (!assistants.length) {
        return;
    }

    if (activeAssistantId !== null) {
        return;
    }

    const generalAssistant =
        assistants.find(

        assistant =>
          assistant.code ===
            "general"

        );

    if (generalAssistant) {

        setActiveAssistantId(

            generalAssistant.id

        );

    }

  }, [

    assistants,

    activeAssistantId,

    setActiveAssistantId,

  ]);



  if (isLoading) {

    return (

      <div
        className="
          w-64
          border-r
          bg-zinc-950
          p-4
          text-white
        "
      >

        Loading assistants...

      </div>

    );
  }

  const sortedAssistants =

    [...assistants].sort(

      (a, b) => {

        if (a.code === "general") {

            return -1;

        }

        if (b.code === "general") {

            return 1;

        }

        return a.name.localeCompare(
            b.name
        );

      }

    );

  return (

    <aside
      className="
        flex
        w-64
        flex-col
        border-r
        border-zinc-800
        bg-zinc-950
      "
    >

      <div
        className="
          border-b
          border-zinc-800
          p-4
        "
      >

        <h2
          className="
            text-lg
            font-semibold
            text-white
          "
        >

          AI Assistants

        </h2>

      </div>

      <div
        className="
          flex-1
          overflow-y-auto
          p-3
        "
      >


        {sortedAssistants.map(

          (assistant) => (

            <button

              key={
                assistant.id
              }

              onClick={() =>

                setActiveAssistantId(

                  assistant.id

                )
              }

              className={`
                mb-2
                w-full
                rounded-xl
                px-4
                py-3
                text-left
                transition

                ${
                  activeAssistantId ===
                  assistant.id

                    ? "bg-white text-black"

                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }
              `}
            >

              <div
                className="font-medium"
              >

                {assistant.name}

              </div>

              <div
                className="
                  mt-1
                  text-xs
                  text-zinc-400
                "
              >

                {assistant.description}

              </div>

            </button>

          )

        )}

      </div>

    </aside>

  );

}