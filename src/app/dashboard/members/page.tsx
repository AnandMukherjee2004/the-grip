"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useOnboarding } from "@/context/OnboardingContext";
import { getInitials } from "@/lib/profile-images";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  isYou?: boolean;
}

export default function MembersPage() {
  const { data: session } = useSession();
  const { workspaces, activeWorkspaceId } = useOnboarding();

  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Anand Mukherjee",
      email: "anandmukherjee2004@gmail.com",
      role: "Owner",
      isYou: true,
    },
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0].replace(".", " "),
      email: inviteEmail,
      role: "Member",
    };

    setMembers([...members, newMember]);
    setInviteEmail("");
    alert(`Invitation sent to ${inviteEmail}!`);
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-[#fafafa] font-sans text-gray-900">
      <main className="flex-grow p-12 lg:p-20 overflow-y-auto flex justify-center items-start">
        <div className="w-full max-w-4xl bg-white border border-gray-150 rounded-[24px] p-12 md:p-16 shadow-sm min-h-[500px]">
          <div className="max-w-2xl space-y-8">
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Members</h1>
              <p className="text-gray-500 text-sm">Manage your team members.</p>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleSendInvite} className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">Invite your team</h2>
              <div className="flex gap-3">
                <input
                  type="email"
                  required
                  placeholder="etufte@grip.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-grow px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all shadow-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Send invite
                </button>
              </div>
            </form>

            {/* Members List */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">Manage members</h2>
              <div className="border border-gray-200 rounded-[20px] p-6 bg-white shadow-inner-sm space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                        {getInitials(member.name)}
                      </div>
                      {/* Details */}
                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                          {member.name}
                          {member.isYou && (
                            <span className="text-xs text-gray-400 font-normal">(You)</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          {member.email}
                        </div>
                      </div>
                    </div>
                    {/* Role Dropdown */}
                    <div className="relative">
                      <select
                        value={member.role}
                        onChange={(e) => {
                          const updated = members.map((m) =>
                            m.id === member.id ? { ...m, role: e.target.value } : m
                          );
                          setMembers(updated);
                        }}
                        className="appearance-none bg-transparent hover:bg-gray-50 text-xs font-semibold text-gray-600 px-3 py-1.5 pr-8 border border-transparent rounded-lg cursor-pointer focus:outline-none transition-colors"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: `right 6px center`,
                          backgroundSize: `16px`,
                          backgroundRepeat: `no-repeat`
                        }}
                      >
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
