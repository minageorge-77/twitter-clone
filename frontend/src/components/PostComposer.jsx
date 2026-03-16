import { useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Send, X } from "lucide-react";
import { postsApi } from "../api/posts";
import { qk } from "../app/queryKeys";

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PostComposer({ variant = "card" }) {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const fileRef = useRef(null);
  const qc = useQueryClient();

  const canPost = useMemo(() => text.trim().length > 0 || Boolean(img), [text, img]);

  const create = useMutation({
    mutationFn: postsApi.create,
    onSuccess: async () => {
      setText("");
      setImg(null);
      if (fileRef.current) fileRef.current.value = "";
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.postsAll }),
        qc.invalidateQueries({ queryKey: qk.postsFollowing }),
      ]);
    },
  });

  const cardClass =
    variant === "card"
      ? "card bg-base-100 border border-base-300 shadow-sm"
      : "bg-base-100 border border-base-300 rounded-box";

  return (
    <div className={`${cardClass} animate-fade-up`}>
      <div className="card-body gap-3 p-4">
        <textarea
          className="textarea textarea-bordered w-full min-h-[88px]"
          placeholder="What’s happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {img ? (
          <div className="relative">
            <img src={img} alt="" className="w-full max-h-[360px] object-cover rounded-box border border-base-300" />
            <button
              type="button"
              className="btn btn-sm btn-circle absolute top-2 right-2"
              onClick={() => setImg(null)}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await fileToDataUrl(file);
                setImg(url);
              }}
            />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="h-4 w-4" />
              Image
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!canPost || create.isPending}
            onClick={() => create.mutate({ text: text.trim() || "", img })}
          >
            {create.isPending ? <span className="loading loading-spinner" /> : <Send className="h-4 w-4" />}
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

