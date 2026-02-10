'use client';

type CommentItem = {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
};

type CommentSectionProps = {
  comments: CommentItem[];
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  return `${months}개월 전`;
}

export default function CommentSection({ comments }: CommentSectionProps) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        댓글 {comments.length}개
      </h3>
      {comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          아직 댓글이 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-card-border bg-card-bg p-4"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {c.userName.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    {c.userName}
                  </span>
                  <span className="ml-2 text-xs text-muted">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-warm-gray-700">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
