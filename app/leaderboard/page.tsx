"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import sampleUsers from "@/data/sample-users.json";
import type { User } from "@/types";

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<"shells" | "hours" | "projects">("shells");
  
  const users = sampleUsers as User[];

  // Sort users based on selected criteria
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      switch (sortBy) {
        case "shells":
          return b.shells_earned - a.shells_earned;
        case "hours":
          return b.total_hours_worked - a.total_hours_worked;
        case "projects":
          return b.projects_count - a.projects_count;
        default:
          return 0;
      }
    });
  }, [users, sortBy]);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "";
    if (rank === 2) return "";
    if (rank === 3) return "";
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-600";
    return "text-vintage-brown";
  };

  return (
    <div className="min-h-screen bg-vintage-beige">
      {/* Header */}
      <header className="border-b-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-block mb-4 text-vintage-brown hover:text-vintage-dark transition-colors">
            ← Back to Home
          </Link>
          <h1 className="masthead text-5xl md:text-7xl mb-3">
            Leaderboard
          </h1>
          <p className="font-steven text-xl md:text-2xl text-vintage-brown">
            Celebrating the top makers of Summer of Making 2025
          </p>
        </div>
      </header>

      {/* Sort Options */}
      <section className="py-8 px-6 md:px-12 bg-vintage-tan sticky top-0 z-10 border-b-2 border-vintage-brown">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSortBy("shells")}
              className={`px-8 py-4 rounded-full font-steven font-bold text-lg transition-all ${
                sortBy === "shells"
                  ? 'bg-vintage-brown text-vintage-beige-light shadow-lg scale-105'
                  : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border-2 border-vintage-brown-light'
              }`}
            >
               Shells Earned
            </button>
            <button
              onClick={() => setSortBy("hours")}
              className={`px-8 py-4 rounded-full font-steven font-bold text-lg transition-all ${
                sortBy === "hours"
                  ? 'bg-vintage-brown text-vintage-beige-light shadow-lg scale-105'
                  : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border-2 border-vintage-brown-light'
              }`}
            >
              ⏰ Hours Worked
            </button>
            <button
              onClick={() => setSortBy("projects")}
              className={`px-8 py-4 rounded-full font-steven font-bold text-lg transition-all ${
                sortBy === "projects"
                  ? 'bg-vintage-brown text-vintage-beige-light shadow-lg scale-105'
                  : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border-2 border-vintage-brown-light'
              }`}
            >
              [Code] Projects Built
            </button>
          </div>
        </div>
      </section>

      {/* Podium - Top 3 */}
      <section className="py-12 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-5xl mx-auto">
          <h2 className="newspaper-heading text-center mb-12">
            Hall of Fame
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 items-end">
            {/* 2nd Place */}
            {sortedUsers[1] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="organic-card text-center bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400"
              >
                <div className="text-6xl mb-4"></div>
                <Image
                  src={sortedUsers[1].avatar || ''}
                  alt={sortedUsers[1].username}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-gray-400 mx-auto mb-4"
                />
                <h3 className="font-national-park text-3xl font-bold text-vintage-dark mb-2">
                  {sortedUsers[1].username}
                </h3>
                <div className="text-4xl font-bold text-gray-600 mb-2">
                  {sortBy === "shells" && `${sortedUsers[1].shells_earned.toLocaleString()} `}
                  {sortBy === "hours" && `${sortedUsers[1].total_hours_worked}h ⏰`}
                  {sortBy === "projects" && `${sortedUsers[1].projects_count} [Code]`}
                </div>
                <p className="font-steven text-vintage-brown">
                  {sortedUsers[1].projects_count} projects • {sortedUsers[1].total_sessions} sessions
                </p>
              </motion.div>
            )}

            {/* 1st Place - Taller */}
            {sortedUsers[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="organic-card text-center bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-500 md:scale-110 md:mb-8"
              >
                <div className="text-7xl mb-4 trophy-glow"></div>
                <Image
                  src={sortedUsers[0].avatar || ''}
                  alt={sortedUsers[0].username}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-yellow-500 mx-auto mb-4"
                />
                <h3 className="font-national-park text-4xl font-bold text-vintage-dark mb-2">
                  {sortedUsers[0].username}
                </h3>
                <div className="text-5xl font-bold text-yellow-700 mb-2">
                  {sortBy === "shells" && `${sortedUsers[0].shells_earned.toLocaleString()} `}
                  {sortBy === "hours" && `${sortedUsers[0].total_hours_worked}h ⏰`}
                  {sortBy === "projects" && `${sortedUsers[0].projects_count} [Code]`}
                </div>
                <p className="font-steven text-vintage-brown">
                  {sortedUsers[0].projects_count} projects • {sortedUsers[0].total_sessions} sessions
                </p>
                {sortedUsers[0].badges && sortedUsers[0].badges.length > 0 && (
                  <div className="mt-4 flex justify-center gap-2">
                    {sortedUsers[0].badges.slice(0, 3).map(badge => (
                      <span key={badge.id} className="text-2xl" title={badge.name}>
                        {badge.icon}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3rd Place */}
            {sortedUsers[2] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="organic-card text-center bg-gradient-to-br from-orange-100 to-orange-200 border-orange-500"
              >
                <div className="text-6xl mb-4"></div>
                <Image
                  src={sortedUsers[2].avatar || ''}
                  alt={sortedUsers[2].username}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-orange-500 mx-auto mb-4"
                />
                <h3 className="font-national-park text-3xl font-bold text-vintage-dark mb-2">
                  {sortedUsers[2].username}
                </h3>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {sortBy === "shells" && `${sortedUsers[2].shells_earned.toLocaleString()} `}
                  {sortBy === "hours" && `${sortedUsers[2].total_hours_worked}h ⏰`}
                  {sortBy === "projects" && `${sortedUsers[2].projects_count} [Code]`}
                </div>
                <p className="font-steven text-vintage-brown">
                  {sortedUsers[2].projects_count} projects • {sortedUsers[2].total_sessions} sessions
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Full Rankings */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="newspaper-heading text-center mb-8">
            Complete Rankings
          </h2>

          <div className="space-y-4">
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              const medal = getMedalEmoji(rank);

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`organic-card hover:scale-[1.01] transition-transform ${
                    rank <= 3 ? 'border-3' : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="text-center min-w-[60px]">
                      {medal ? (
                        <div className="text-5xl">{medal}</div>
                      ) : (
                        <div className={`text-4xl font-bold ${getRankColor(rank)}`}>
                          #{rank}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <Image
                      src={user.avatar || ''}
                      alt={user.username}
                      width={80}
                      height={80}
                      className={`rounded-full border-4 ${
                        rank === 1 ? 'border-yellow-500' :
                        rank === 2 ? 'border-gray-400' :
                        rank === 3 ? 'border-orange-500' :
                        'border-vintage-brown'
                      }`}
                    />

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="font-national-park text-2xl md:text-3xl font-bold text-vintage-dark mb-1">
                        {user.username}
                      </h3>
                      {user.bio && (
                        <p className="font-steven text-sm text-vintage-brown line-clamp-1 mb-2">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm font-steven text-vintage-dark">
                        <span> {user.location || 'Unknown'}</span>
                        <span>[Code] {user.projects_count} projects</span>
                        <span> {user.total_sessions} sessions</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-bold text-vintage-brown mb-1">
                        {sortBy === "shells" && user.shells_earned.toLocaleString()}
                        {sortBy === "hours" && `${user.total_hours_worked}h`}
                        {sortBy === "projects" && user.projects_count}
                      </div>
                      <div className="text-sm font-steven text-vintage-brown">
                        {sortBy === "shells" && "Shells Earned"}
                        {sortBy === "hours" && "Hours Worked"}
                        {sortBy === "projects" && "Projects Built"}
                      </div>
                      
                      {/* Badges */}
                      {user.badges && user.badges.length > 0 && (
                        <div className="mt-2 flex justify-end gap-1">
                          {user.badges.slice(0, 3).map(badge => (
                            <span 
                              key={badge.id} 
                              className="text-xl"
                              title={badge.name}
                            >
                              {badge.icon}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Summary */}
      <section className="py-12 px-6 md:px-12 bg-vintage-tan">
        <div className="max-w-5xl mx-auto">
          <h2 className="newspaper-heading text-center mb-8">
            By the Numbers
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="organic-card text-center">
              <div className="text-4xl mb-2"></div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {users.length}
              </div>
              <div className="font-steven text-vintage-dark">Total Makers</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-2"></div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {users.reduce((acc, u) => acc + u.shells_earned, 0).toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Shells Earned</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-2">⏰</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {users.reduce((acc, u) => acc + u.total_hours_worked, 0).toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Hours Worked</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-2">[Code]</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {users.reduce((acc, u) => acc + u.projects_count, 0)}
              </div>
              <div className="font-steven text-vintage-dark">Projects Built</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
