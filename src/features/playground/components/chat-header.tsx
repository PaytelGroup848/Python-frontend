"use client";

import {
    Bot,
} from "lucide-react";

import {
    useAssistants,
} from "../hooks/use-assistants";

import {
    useConversationStore,
} from "@/features/chat/stores/conversation-store";

export function ChatHeader() {

    const activeAssistantId =
        useConversationStore(
            state =>
                state.activeAssistantId
        );

    const conversations =
        useConversationStore(
            state =>
                state.conversations
        );

    const activeConversationId =
        useConversationStore(
            state =>
                state.activeConversationId
        );

    const {
        data: assistants = [],
    } = useAssistants();

    const assistant =
        assistants.find(

            item =>
                item.id ===
                activeAssistantId

        );

    const conversation =
        conversations.find(

            item =>
                item.id ===
                activeConversationId

        );

    return (

        <div
            className="
                flex
                items-center
                justify-between
                border-b
                border-zinc-200
                bg-white
                px-6
                py-4
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-black
                        text-white
                    "
                >

                    <Bot size={22} />

                </div>

                <div>

                    <h2
                        className="
                            text-lg
                            font-semibold
                        "
                    >

                        {assistant?.name ??
                            "General Chat"}

                    </h2>

                    <p
                        className="
                            text-sm
                            text-zinc-500
                        "
                    >

                        {assistant?.description ??
                            "Universal AI Assistant"}

                    </p>

                    

                </div>

                <div
                    className="
                        mt-2
                        flex
                        flex-wrap
                        gap-2
                    "
                >

                    {(assistant?.code === "general" ||
                        assistant?.config?.document_chat_enabled) && (
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs">
                            Documents
                        </span>
                    )}

                    {(assistant?.code === "general" ||
                        assistant?.config?.voice_enabled) && (
                        <span className="rounded bg-green-100 px-2 py-1 text-xs">
                            Voice
                        </span>
                    )}

                    {assistant?.config?.web_search_enabled && (
                        <span className="rounded bg-purple-100 px-2 py-1 text-xs">
                            Web Search
                        </span>
                    )}

                    {assistant?.config?.tool_calling_enabled && (
                        <span className="rounded bg-orange-100 px-2 py-1 text-xs">
                            Tools
                        </span>
                    )}

                    {assistant?.config?.rag_enabled && (
                        <span className="rounded bg-cyan-100 px-2 py-1 text-xs">
                            RAG
                        </span>
                    )}

                    {assistant?.config?.memory_enabled && (
                        <span className="rounded bg-emerald-100 px-2 py-1 text-xs">
                            Memory
                        </span>
                    )}

                    {assistant?.config?.ocr_enabled && (
                        <span className="rounded bg-pink-100 px-2 py-1 text-xs">
                            OCR
                        </span>
                    )}

                    {assistant?.config?.image_generation_enabled && (
                        <span className="rounded bg-yellow-100 px-2 py-1 text-xs">
                            Image
                        </span>
                    )}

                </div>

            </div>

            <div
                className="
                    text-right
                "
            >

                <p
                    className="
                        text-sm
                        font-medium
                    "
                >

                    {conversation?.title ??
                        "New Chat"}

                </p>

                <p
                    className="
                        text-xs
                        text-green-600
                    "
                >

                    ● Online

                </p>

            </div>

        </div>

    );

}