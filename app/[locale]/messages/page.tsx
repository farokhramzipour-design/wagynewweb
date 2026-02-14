"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { media, messaging } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { ErrorState } from "@/components/ui/error";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function MessagesPage() {
  const locale = useLocale();
  const [userId, setUserId] = useState<number | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [composer, setComposer] = useState("");
  const [messageId, setMessageId] = useState<number | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaId, setMediaId] = useState<number | null>(null);

  const messages = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => messaging.listMessages(conversationId as number, 50),
    enabled: Boolean(conversationId)
  });

  const send = useMutation({
    mutationFn: () =>
      messaging.sendMessage({
        conversation_id: conversationId as number,
        sender_user_id: 0,
        message_type: "text",
        body: composer
      }),
    onSuccess: () => setComposer("")
  });

  const requestUpload = useMutation({
    mutationFn: () =>
      media.uploadUrl({
        media_type: "message",
        storage_key: `messages/${conversationId}-${Date.now()}`,
        url: mediaUrl
      }),
    onSuccess: (data: any) => {
      if (data?.media?.media_id) setMediaId(data.media.media_id);
    }
  });

  const flagMessage = useMutation({
    mutationFn: () =>
      messaging.flagMessage(messageId as number, {
        is_flagged: true,
        flag_reason: "user_report"
      })
  });

  const sortedMessages = useMemo(() => {
    if (!messages.data) return [];
    return [...messages.data].sort((a: any, b: any) => a.message_id - b.message_id);
  }, [messages.data]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "گفتگوها" : "Conversations"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-subtle">
            {locale === "fa"
              ? "برای نمایش گفتگو، شناسه گفتگو را وارد کنید."
              : "Enter a conversation_id to load messages."}
          </div>
          <Input
            type="number"
            placeholder="user_id"
            value={userId ?? ""}
            onChange={(event) => setUserId(event.target.value ? Number(event.target.value) : null)}
          />
          {conversations.isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          )}
          {conversations.isError && (
            <ErrorState title={locale === "fa" ? "خطا در گفتگوها" : "Failed to load"} />
          )}
          <div className="space-y-2">
            {conversations.data?.map((conv) => (
              <button
                key={conv.conversation_id}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm text-start"
                onClick={() => setConversationId(conv.conversation_id)}
              >
                #{conv.conversation_id} {conv.booking_id ? `(B:${conv.booking_id})` : ""}
              </button>
            ))}
          </div>
          <Input
            type="number"
            placeholder="conversation_id"
            value={conversationId ?? ""}
            onChange={(event) => setConversationId(event.target.value ? Number(event.target.value) : null)}
          />
        </CardContent>
      </Card>

      <Card className="flex h-[70vh] flex-col">
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "پیام‌ها" : "Thread"}</CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-border bg-white p-4">
            {messages.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            )}
            {messages.isError && (
              <ErrorState title={locale === "fa" ? "خطا در پیام‌ها" : "Messages failed"} />
            )}
            {sortedMessages.length === 0 && !messages.isLoading && (
              <EmptyState title={locale === "fa" ? "پیامی وجود ندارد" : "No messages"} />
            )}
            {sortedMessages.map((message: any) => (
              <div key={message.message_id} className="rounded-xl bg-brand-50 p-3 text-sm">
                <div className="text-xs text-subtle">#{message.message_id}</div>
                <div>{message.body ?? (locale === "fa" ? "پیام بدون متن" : "Attachment")}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={composer} onChange={(event) => setComposer(event.target.value)} placeholder="پیام خود را بنویسید" />
            <Button disabled={!conversationId || send.isPending || !composer} onClick={() => send.mutate()}>
              {locale === "fa" ? "ارسال" : "Send"}
            </Button>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <Input
              type="number"
              placeholder="message_id"
              value={messageId ?? ""}
              onChange={(event) => setMessageId(event.target.value ? Number(event.target.value) : null)}
            />
            <Input placeholder="media url" value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} />
            <Button disabled={!conversationId || !mediaUrl} onClick={() => requestUpload.mutate()}>
              {locale === "fa" ? "درخواست آپلود" : "Upload request"}
            </Button>
          </div>
          <Button
            variant="secondary"
            disabled={!messageId || !mediaId}
            onClick={() => messaging.attachMedia({ message_id: messageId as number, media_id: mediaId as number })}
          >
            {locale === "fa" ? "اتصال فایل" : "Attach media"}
          </Button>
          <Button variant="ghost" disabled={!messageId} onClick={() => flagMessage.mutate()}>
            {locale === "fa" ? "گزارش پیام" : "Flag message"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
  const conversations = useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => messaging.listConversations(userId as number),
    enabled: Boolean(userId)
  });
