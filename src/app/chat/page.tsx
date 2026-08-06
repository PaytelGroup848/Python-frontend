import { AuthGuard } from "@/components/auth/auth-guard";
import { ChatWindow } from "@/features/chat/components/chat-window";
import { ConversationSidebar } from "@/features/chat/components/conversation-sidebar";
import { ChatHeader } from "@/features/playground/components/chat-header";

export default function ChatPage() {
  return (
    <AuthGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
        <ConversationSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatHeader />
          <div className="flex-1 overflow-hidden">
            <ChatWindow />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}