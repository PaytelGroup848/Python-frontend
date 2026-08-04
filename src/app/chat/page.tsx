import { DashboardLayout }
  from "@/components/layout/dashboard-layout";

import { AuthGuard }
  from "@/components/auth/auth-guard";

import { ChatWindow }
  from "@/features/chat/components/chat-window";

import {
  ConversationSidebar,
} from "@/features/chat/components/conversation-sidebar";

import {
  AssistantSelector,
} from "@/features/playground/components/assistant-selector";

import {
    ChatHeader,
} from "@/features/playground/components/chat-header";

export default function ChatPage() {

  return (
    <AuthGuard>

      <DashboardLayout>

        <div className="flex h-full">

            <AssistantSelector />

            <ConversationSidebar />

        <div
            className="
            flex
            flex-1
            flex-col
          "
        >

          <ChatHeader />

          <div
              className="
              flex-1
              overflow-hidden
            "
          >

            <ChatWindow />

          </div>

        </div>

      </div>

      </DashboardLayout>

    </AuthGuard>
  );
}