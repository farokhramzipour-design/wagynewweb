"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { media, reviews } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsPage() {
  const locale = useLocale();
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [providerId, setProviderId] = useState<number | null>(null);
  const [serviceTypeId, setServiceTypeId] = useState<number | null>(null);

  const createReview = useMutation({ mutationFn: reviews.create });
  const respond = useMutation({ mutationFn: (payload: { review_id: number; response_text?: string | null }) => reviews.respond(payload.review_id, { response_text: payload.response_text }) });
  const requestMediaUpload = useMutation({
    mutationFn: () =>
      media.uploadUrl({
        media_type: "review",
        storage_key: `reviews/${reviewId}-${Date.now()}`,
        url: mediaUrl
      }),
    onSuccess: (data: any) => {
      if (data?.media?.media_id) setMediaId(data.media.media_id);
    }
  });
  const listReviews = useQuery({
    queryKey: ["reviews", providerId, serviceTypeId],
    queryFn: () => reviews.list(providerId as number, serviceTypeId ?? null),
    enabled: Boolean(providerId)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "ثبت نظر" : "Leave review"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input id="booking_id" type="number" placeholder="booking_id" />
            <Input id="reviewer_user_id" type="number" placeholder="reviewer_user_id" />
            <Input id="reviewee_user_id" type="number" placeholder="reviewee_user_id" />
            <Input id="rating" type="number" placeholder="rating" />
          </div>
          <Textarea id="review_text" placeholder={locale === "fa" ? "متن نظر" : "Review"} />
          <Input id="review_public" placeholder={locale === "fa" ? "عمومی؟ true/false" : "Public? true/false"} />
          <Button
            onClick={() => {
              const booking_id = Number((document.getElementById("booking_id") as HTMLInputElement | null)?.value ?? 0);
              const reviewer_user_id = Number((document.getElementById("reviewer_user_id") as HTMLInputElement | null)?.value ?? 0);
              const reviewee_user_id = Number((document.getElementById("reviewee_user_id") as HTMLInputElement | null)?.value ?? 0);
              const rating = Number((document.getElementById("rating") as HTMLInputElement | null)?.value ?? 0);
              const review_text = (document.getElementById("review_text") as HTMLTextAreaElement | null)?.value ?? "";
              const is_public = (document.getElementById("review_public") as HTMLInputElement | null)?.value === "true";
              createReview.mutate({ booking_id, reviewer_user_id, reviewee_user_id, rating, review_text, is_public });
            }}
          >
            {locale === "fa" ? "ارسال" : "Submit"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "پاسخ به نظر" : "Respond"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="review_id"
            value={reviewId ?? ""}
            onChange={(event) => setReviewId(event.target.value ? Number(event.target.value) : null)}
          />
          <Textarea id="response_text" placeholder={locale === "fa" ? "پاسخ" : "Response"} />
          <Button
            disabled={!reviewId}
            onClick={() => {
              const response_text = (document.getElementById("response_text") as HTMLTextAreaElement | null)?.value ?? "";
              respond.mutate({ review_id: reviewId as number, response_text });
            }}
          >
            {locale === "fa" ? "ارسال پاسخ" : "Send response"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "آپلود عکس نظر" : "Review media"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="review_id"
            value={reviewId ?? ""}
            onChange={(event) => setReviewId(event.target.value ? Number(event.target.value) : null)}
          />
          <Input placeholder={locale === "fa" ? "آدرس فایل" : "File URL"} value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} />
          <Button disabled={!reviewId || !mediaUrl} onClick={() => requestMediaUpload.mutate()}>
            {locale === "fa" ? "درخواست آپلود" : "Request upload"}
          </Button>
          <Button
            variant="secondary"
            disabled={!reviewId || !mediaId}
            onClick={() => reviews.addMedia(reviewId as number, { media_id: mediaId as number })}
          >
            {locale === "fa" ? "اتصال فایل" : "Attach media"}
          </Button>
          <Button
            variant="ghost"
            disabled={!reviewId}
            onClick={() => reviews.visibility(reviewId as number, { is_public: true })}
          >
            {locale === "fa" ? "عمومی کردن" : "Make public"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "لیست نظرات" : "Reviews list"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              type="number"
              placeholder="provider_id"
              value={providerId ?? ""}
              onChange={(event) => setProviderId(event.target.value ? Number(event.target.value) : null)}
            />
            <Input
              type="number"
              placeholder="service_type_id"
              value={serviceTypeId ?? ""}
              onChange={(event) => setServiceTypeId(event.target.value ? Number(event.target.value) : null)}
            />
          </div>
          <div className="grid gap-2">
            {listReviews.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            )}
            {listReviews.data?.map((review: any) => (
              <div key={review.review_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                {review.rating}/5 - {review.review_text ?? ""}
              </div>
            ))}
            {listReviews.data?.length === 0 && (
              <EmptyState title={locale === "fa" ? "نظری ثبت نشده" : "No reviews"} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
