"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import usersData from "@/data/som-users.json";
import shellsData from "@/data/som-shells.json";
import projectsData from "@/data/som-projects.json";

const usersObj = usersData as Record<string, any>;
const usersArray = Object.values(usersObj);
const shellsArray = shellsData as Array<any>;
const projectsArray = projectsData as Array<any>;

const shellsMap = shellsArray.reduce((acc: any, shell: any) => {
  acc[shell.slack_id] = shell;
  return acc;
}, {});

// Create search index - runs once on load
const createSearchIndex = () => {
  const index = new Map<number, string>();
  
  usersArray.forEach((user: any) => {
    const searchText = [
      user.display_name || '',
      user.slack_id || '',
      user.bio || ''
    ].join(' ').toLowerCase();
    
    index.set(user.id, searchText);
  });
  
  return index;
};

const searchIndex = createSearchIndex();

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<"shells" | "hours" | "projects">("hours");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounce search input for smoother typing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150); // 150ms debounce - feels instant but prevents excessive renders
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);
  
  // Pre-compute sorted users (without search filter) - this is the global ranking
  const allSortedUsers = useMemo(() => {
    return [...usersArray].sort((a: any, b: any) => {
      switch (sortBy) {
        case "shells":
          const aShells = shellsMap[a.slack_id]?.total_shells_earned || 0;
          const bShells = shellsMap[b.slack_id]?.total_shells_earned || 0;
          return bShells - aShells;
        case "hours":
          return (b.coding_time_seconds || 0) - (a.coding_time_seconds || 0);
        case "projects":
          return (b.projects_count || 0) - (a.projects_count || 0);
        default:
          return 0;
      }
    });
  }, [sortBy]);
  
  // Get user's global rank (not search rank)
  const getUserRank = (user: any) => {
    return allSortedUsers.findIndex((u: any) => u.id === user.id) + 1;
  };
  
  // Get user's projects
  const getUserProjects = (user: any) => {
    return projectsArray.filter((project: any) => project.slack_id === user.slack_id);
  };
  
  // Ultra-fast search using pre-built index
  const sortedUsers = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return allSortedUsers;
    }
    
    const query = debouncedSearchQuery.toLowerCase();
    
    // Use index for instant lookup - O(n) with early string termination
    return allSortedUsers.filter((user: any) => {
      const userSearchText = searchIndex.get(user.id);
      return userSearchText && userSearchText.includes(query);
    });
  }, [allSortedUsers, debouncedSearchQuery]);

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
        <div className="max-w-7xl mx-auto space-y-6">
          
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
              Hours Worked
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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-2xl">
                🔍
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search makers by name, slack ID, or bio..."
                className="w-full pl-16 pr-12 py-4 rounded-full border-3 border-vintage-brown font-steven text-lg bg-vintage-beige-light text-vintage-dark placeholder-vintage-brown-light focus:outline-none focus:ring-4 focus:ring-vintage-brown-light transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-vintage-brown hover:text-vintage-dark transition-colors text-3xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-vintage-beige"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            {debouncedSearchQuery && (
              <p className="text-center mt-2 font-steven text-vintage-brown">
                Found {sortedUsers.length} maker{sortedUsers.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Podium - Top 3 - Only show when not searching */}
      {!debouncedSearchQuery && (
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
                onClick={() => setSelectedUser(sortedUsers[1])}
                className="organic-card text-center bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="text-6xl mb-4">2nd</div>
                {sortedUsers[1].avatar && (
                  <Image
                    src={sortedUsers[1].avatar}
                    alt={sortedUsers[1].display_name || 'User'}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-gray-400 mx-auto mb-4"
                  />
                )}
                <h3 className="font-national-park text-3xl font-bold text-vintage-dark mb-2">
                  {sortedUsers[1].display_name || sortedUsers[1].slack_id}
                </h3>
                <div className="text-4xl font-bold text-gray-600 mb-2">
                  {sortBy === "shells" && `${Math.round(shellsMap[sortedUsers[1].slack_id]?.total_shells_earned || 0)} shells`}
                  {sortBy === "hours" && `${Math.round((sortedUsers[1].coding_time_seconds || 0) / 3600)}h`}
                  {sortBy === "projects" && `${sortedUsers[1].projects_count || 0}`}
                </div>
                <p className="font-steven text-vintage-brown">
                  {sortedUsers[1].devlogs_count || 0} devlogs
                </p>
              </motion.div>
            )}

            {/* 1st Place - Taller */}
            {sortedUsers[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedUser(sortedUsers[0])}
                className="organic-card text-center bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-500 md:scale-110 md:mb-8 cursor-pointer hover:scale-[1.15] transition-transform"
              >
                <div className="text-7xl mb-4 font-national-park font-bold">1st</div>
                {sortedUsers[0].avatar && (
                  <Image
                    src={sortedUsers[0].avatar}
                    alt={sortedUsers[0].display_name || 'User'}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-yellow-500 mx-auto mb-4"
                  />
                )}
                <h3 className="font-national-park text-4xl font-bold text-vintage-dark mb-2">
                  {sortedUsers[0].display_name || sortedUsers[0].slack_id}
                </h3>
                <div className="text-5xl font-bold text-yellow-700 mb-2">
                  {sortBy === "shells" && `${Math.round(shellsMap[sortedUsers[0].slack_id]?.total_shells_earned || 0)} shells`}
                  {sortBy === "hours" && `${Math.round((sortedUsers[0].coding_time_seconds || 0) / 3600)}h`}
                  {sortBy === "projects" && `${sortedUsers[0].projects_count || 0}`}
                </div>
                <p className="font-steven text-vintage-brown">
                  {sortedUsers[0].devlogs_count || 0} devlogs
                </p>
                {sortedUsers[0].badges && sortedUsers[0].badges.length > 0 && (
                  <div className="mt-4 flex justify-center gap-2">
                    {sortedUsers[0].badges.slice(0, 3).map((badge: any, idx: number) => {
                      if (typeof badge.icon === 'string' && badge.icon.startsWith('http')) {
                        return (
                          <img key={idx} src={badge.icon} alt={badge.name} className="w-8 h-8" title={badge.name} />
                        );
                      }
                      return (
                        <span key={idx} className="text-2xl" title={badge.name}>
                          {badge.icon}
                        </span>
                      );
                    })}
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
                onClick={() => setSelectedUser(sortedUsers[2])}
                className="organic-card text-center bg-gradient-to-br from-orange-100 to-orange-200 border-orange-500 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="text-6xl mb-4">3rd</div>
                {sortedUsers[2].avatar && (
                  <Image
                    src={sortedUsers[2].avatar}
                    alt={sortedUsers[2].display_name || 'User'}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-orange-500 mx-auto mb-4"
                  />
                )}
                <h3 className="font-national-park text-3xl font-bold text-vintage-dark mb-2">
                  {sortedUsers[2].display_name || sortedUsers[2].slack_id}
                </h3>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {sortBy === "shells" && `${Math.round(shellsMap[sortedUsers[2].slack_id]?.total_shells_earned || 0)} shells`}
                  {sortBy === "hours" && `${Math.round((sortedUsers[2].coding_time_seconds || 0) / 3600)}h`}
                  {sortBy === "projects" && `${sortedUsers[2].projects_count || 0}`}
                </div>
                <p className="font-steven text-vintage-brown">
                  {sortedUsers[2].devlogs_count || 0} devlogs
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Full Rankings */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="newspaper-heading text-center mb-8">
            {debouncedSearchQuery ? 'Search Results' : 'Complete Rankings'}
          </h2>

          <div className="space-y-4">
            {sortedUsers.slice(0, debouncedSearchQuery ? sortedUsers.length : 50).map((user: any, index: number) => {
              const globalRank = getUserRank(user); // Use global rank, not search position
              const medal = getMedalEmoji(globalRank);
              const hours = Math.round((user.coding_time_seconds || 0) / 3600);
              const shellsEarned = Math.round(shellsMap[user.slack_id]?.total_shells_earned || 0);

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                  onClick={() => setSelectedUser(user)}
                  className={`organic-card hover:scale-[1.01] transition-transform cursor-pointer ${
                    globalRank <= 3 ? 'border-3' : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="text-center min-w-[60px]">
                      {medal ? (
                        <div className="text-5xl">{medal}</div>
                      ) : (
                        <div className={`text-4xl font-bold ${getRankColor(globalRank)}`}>
                          #{globalRank}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    {user.avatar && (
                      <Image
                        src={user.avatar}
                        alt={user.display_name || 'User'}
                        width={80}
                        height={80}
                        className={`rounded-full border-4 ${
                          globalRank === 1 ? 'border-yellow-500' :
                          globalRank === 2 ? 'border-gray-400' :
                          globalRank === 3 ? 'border-orange-500' :
                          'border-vintage-brown'
                        }`}
                      />
                    )}

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="font-national-park text-2xl md:text-3xl font-bold text-vintage-dark mb-1">
                        {user.display_name || user.slack_id}
                      </h3>
                      {user.bio && (
                        <p className="font-steven text-sm text-vintage-brown line-clamp-1 mb-2">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm font-steven text-vintage-dark">
                        <span>{user.projects_count || 0} projects</span>
                        <span>{user.devlogs_count || 0} devlogs</span>
                        <span>{user.votes_count || 0} votes</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-bold text-vintage-brown mb-1">
                        {sortBy === "shells" && `${shellsEarned}`}
                        {sortBy === "hours" && `${hours}h`}
                        {sortBy === "projects" && (user.projects_count || 0)}
                      </div>
                      <div className="text-sm font-steven text-vintage-brown">
                        {sortBy === "shells" && "Shells Earned"}
                        {sortBy === "hours" && "Hours Worked"}
                        {sortBy === "projects" && "Projects Built"}
                      </div>
                      
                      {/* Badges */}
                      {user.badges && user.badges.length > 0 && (
                        <div className="mt-2 flex justify-end gap-1">
                          {user.badges.slice(0, 3).map((badge: any, idx: number) => {
                            if (typeof badge.icon === 'string' && badge.icon.startsWith('http')) {
                              return (
                                <img key={idx} src={badge.icon} alt={badge.name} className="w-6 h-6" title={badge.name} />
                              );
                            }
                            return (
                              <span 
                                key={idx} 
                                className="text-xl"
                                title={badge.name}
                              >
                                {badge.icon}
                              </span>
                            );
                          })}
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
              <div className="text-4xl mb-2">[Users]</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {usersArray.length}
              </div>
              <div className="font-steven text-vintage-dark">Total Makers</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-2">[Projects]</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {usersArray.reduce((acc: number, u: any) => acc + (u.projects_count || 0), 0).toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Total Projects</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-2">[Time]</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {Math.round(usersArray.reduce((acc: number, u: any) => acc + (u.coding_time_seconds || 0), 0) / 3600).toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Hours Worked</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-2">[Devlogs]</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {usersArray.reduce((acc: number, u: any) => acc + (u.devlogs_count || 0), 0).toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Total Devlogs</div>
            </div>
          </div>
        </div>
      </section>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-vintage-beige border-4 border-vintage-brown rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="sticky top-4 right-4 float-right text-vintage-brown hover:text-vintage-dark text-4xl font-bold w-12 h-12 flex items-center justify-center rounded-full bg-vintage-beige-light hover:bg-vintage-tan border-2 border-vintage-brown transition-all z-10"
                aria-label="Close modal"
              >
                ×
              </button>

              <div className="p-8">
                {/* User Header */}
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
                  {selectedUser.avatar && (
                    <Image
                      src={selectedUser.avatar}
                      alt={selectedUser.display_name || 'User'}
                      width={150}
                      height={150}
                      className="rounded-full border-4 border-vintage-brown"
                    />
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="font-national-park text-4xl md:text-5xl font-bold text-vintage-dark mb-2">
                      {selectedUser.display_name || selectedUser.slack_id}
                    </h2>
                    {selectedUser.bio && (
                      <p className="font-steven text-lg text-vintage-brown mb-4">
                        {selectedUser.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {selectedUser.badges && selectedUser.badges.map((badge: any, idx: number) => (
                        <div
                          key={idx}
                          className="px-3 py-1 bg-vintage-beige-light border-2 border-vintage-brown rounded-full flex items-center gap-2"
                          title={badge.name}
                        >
                          {typeof badge.icon === 'string' && badge.icon.startsWith('http') ? (
                            <img src={badge.icon} alt={badge.name} className="w-6 h-6" />
                          ) : (
                            <span className="text-xl">{badge.icon}</span>
                          )}
                          <span className="font-steven text-sm">{badge.text || badge.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-2xl font-bold text-vintage-brown">
                      Rank #{getUserRank(selectedUser)} in {sortBy === 'shells' ? 'Shells Earned' : sortBy === 'hours' ? 'Hours Worked' : 'Projects Built'}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="organic-card text-center">
                    <div className="text-3xl font-bold text-vintage-brown">
                      {selectedUser.projects_count || 0}
                    </div>
                    <div className="font-steven text-vintage-dark">Projects</div>
                  </div>
                  <div className="organic-card text-center">
                    <div className="text-3xl font-bold text-vintage-brown">
                      {Math.round((selectedUser.coding_time_seconds || 0) / 3600)}h
                    </div>
                    <div className="font-steven text-vintage-dark">Hours Coded</div>
                  </div>
                  <div className="organic-card text-center">
                    <div className="text-3xl font-bold text-vintage-brown">
                      {selectedUser.devlogs_count || 0}
                    </div>
                    <div className="font-steven text-vintage-dark">Devlogs</div>
                  </div>
                  <div className="organic-card text-center">
                    <div className="text-3xl font-bold text-vintage-brown">
                      {Math.round(shellsMap[selectedUser.slack_id]?.total_shells_earned || 0)}
                    </div>
                    <div className="font-steven text-vintage-dark">Shells Earned</div>
                  </div>
                </div>

                {/* Projects Built */}
                {(() => {
                  const userProjects = getUserProjects(selectedUser);
                  return userProjects.length > 0 && (
                    <div className="mb-8">
                      <h3 className="newspaper-heading mb-4">
                        Projects Built ({userProjects.length})
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {userProjects.slice(0, 10).map((project: any) => (
                          <div key={project.id} className="organic-card hover:scale-[1.01] transition-transform">
                            <h4 className="font-national-park text-xl font-bold text-vintage-dark mb-1">
                              {project.title}
                            </h4>
                            <p className="font-steven text-sm text-vintage-brown line-clamp-2 mb-2">
                              {project.description?.replace(/<[^>]*>/g, '')}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs font-steven">
                              <span className="px-2 py-1 bg-vintage-tan rounded">
                                {project.category}
                              </span>
                              <span className="px-2 py-1 bg-vintage-tan rounded">
                                {Math.round((project.total_seconds_coded || 0) / 3600)}h coded
                              </span>
                              <span className="px-2 py-1 bg-vintage-tan rounded">
                                {project.devlogs_count || 0} devlogs
                              </span>
                            </div>
                          </div>
                        ))}
                        {userProjects.length > 10 && (
                          <p className="text-center font-steven text-vintage-brown">
                            ...and {userProjects.length - 10} more projects
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Shell Transactions */}
                {shellsMap[selectedUser.slack_id]?.payouts && (
                  <div>
                    <h3 className="newspaper-heading mb-4">
                      Shell Transactions ({shellsMap[selectedUser.slack_id].payouts.length})
                    </h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {shellsMap[selectedUser.slack_id].payouts
                        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .slice(0, 20)
                        .map((payout: any, idx: number) => {
                          const amount = parseFloat(payout.amount);
                          const isPositive = amount > 0;
                          return (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                                isPositive
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-red-50 border-red-300'
                              }`}
                            >
                              <div className="flex-1">
                                <div className="font-steven font-bold">
                                  {payout.type === 'User' ? '💰 Earned' : '🛍️ Shop Order'}
                                </div>
                                <div className="text-xs text-vintage-brown">
                                  {new Date(payout.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              <div className={`text-2xl font-bold ${
                                isPositive ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {isPositive ? '+' : ''}{amount}
                              </div>
                            </div>
                          );
                        })}
                      {shellsMap[selectedUser.slack_id].payouts.length > 20 && (
                        <p className="text-center font-steven text-vintage-brown">
                          ...and {shellsMap[selectedUser.slack_id].payouts.length - 20} more transactions
                        </p>
                      )}
                    </div>
                    <div className="mt-4 p-4 bg-vintage-beige-light rounded-lg border-2 border-vintage-brown">
                      <div className="flex justify-between items-center">
                        <span className="font-steven text-lg">Current Balance:</span>
                        <span className="font-national-park text-2xl font-bold text-vintage-brown">
                          {shellsMap[selectedUser.slack_id].current_shells} shells
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
