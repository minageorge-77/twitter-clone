import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users";
import { qk } from "../app/queryKeys";
import { useMe } from "../hooks/useMe";

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SettingsPage() {
  const me = useMe();
  const qc = useQueryClient();

  const [fullName, setFullName] = useState(me.data?.fullName ?? "");
  const [email, setEmail] = useState(me.data?.email ?? "");
  const [username, setUsername] = useState(me.data?.username ?? "");
  const [bio, setBio] = useState(me.data?.bio ?? "");
  const [link, setLink] = useState(me.data?.link ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  const profileFileRef = useRef(null);
  const coverFileRef = useRef(null);

  const update = useMutation({
    mutationFn: usersApi.update,
    onSuccess: async (updated) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.me }),
        qc.invalidateQueries({ queryKey: qk.profile(updated?.username ?? me.data?.username) }),
      ]);
      setCurrentPassword("");
      setNewPassword("");
      setProfileImg(null);
      setCoverImg(null);
      if (profileFileRef.current) profileFileRef.current.value = "";
      if (coverFileRef.current) coverFileRef.current.value = "";
    },
  });

  const error = update.error?.message;

  return (
    <div className="space-y-3">
      <div className="text-xl font-bold">Settings</div>

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : null}

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Full name</span>
              </div>
              <input className="input input-bordered" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input className="input input-bordered" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input className="input input-bordered" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Link</span>
              </div>
              <input className="input input-bordered" value={link} onChange={(e) => setLink(e.target.value)} />
            </label>
          </div>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Bio</span>
            </div>
            <textarea className="textarea textarea-bordered min-h-[96px]" value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>

          <div className="divider">Images</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold">Profile image</div>
              <input
                ref={profileFileRef}
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setProfileImg(await fileToDataUrl(file));
                }}
              />
              {profileImg ? <img src={profileImg} alt="" className="rounded-box border border-base-300 max-h-48 object-cover" /> : null}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold">Cover image</div>
              <input
                ref={coverFileRef}
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setCoverImg(await fileToDataUrl(file));
                }}
              />
              {coverImg ? <img src={coverImg} alt="" className="rounded-box border border-base-300 max-h-48 object-cover" /> : null}
            </div>
          </div>

          <div className="divider">Password (optional)</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Current password</span>
              </div>
              <input
                className="input input-bordered"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">New password</span>
              </div>
              <input className="input input-bordered" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              className="btn btn-primary"
              disabled={update.isPending}
              onClick={() =>
                update.mutate({
                  fullName,
                  email,
                  username,
                  bio,
                  link,
                  currentPassword: currentPassword || undefined,
                  newPassword: newPassword || undefined,
                  profileImg: profileImg || undefined,
                  coverImg: coverImg || undefined,
                })
              }
            >
              {update.isPending ? <span className="loading loading-spinner" /> : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

