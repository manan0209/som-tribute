"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import sampleUsers from "@/data/sample-users.json";
import type { User } from "@/types";

export default function MakersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "name" | "projects">("rank");
  
  const users = sampleUsers as User[];

  // Filter and sort makers
  const filteredMakers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rank":
          return (a.rank || 999) - (b.rank || 999);
        case "name":
          return a.username.localeCompare(b.username);
        case "projects":
          return b.projects_count - a.projects_count;
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-vintage-beige">
      {/* Header */}
      <header className="border-b-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-block mb-4 text-vintage-brown hover:text-vintage-dark transition-colors">
            ← Back to Home
          </Link>
          <h1 className="masthead text-5xl md:text-7xl mb-3">
            The Makers
          </h1>
          <p className="font-steven text-xl md:text-2xl text-vintage-brown">
            Meet the incredible people who made this summer unforgettable
          </p>
        </div>
      </header>

      {/* Search & Filter */}
      <section className="py-8 px-6 md:px-12 bg-vintage-tan sticky top-0 z-10 border-b-2 border-vintage-brown">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder=" Search makers by name, location, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-3 border-vintage-brown bg-vintage-beige-light font-steven text-lg focus:outline-none focus:ring-4 focus:ring-vintage-brown-light"
            />
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy("rank")}
                className={`px-6 py-3 rounded-full font-steven font-bold transition-all ${
                  sortBy === "rank"
                    ? 'bg-vintage-brown text-vintage-beige-light shadow-lg'
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border-2 border-vintage-brown-light'
                }`}
              >
                 By Rank
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={`px-6 py-3 rounded-full font-steven font-bold transition-all ${
                  sortBy === "name"
                    ? 'bg-vintage-brown text-vintage-beige-light shadow-lg'
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border-2 border-vintage-brown-light'
                }`}
              >
                 Alphabetical
              </button>
              <button
                onClick={() => setSortBy("projects")}
                className={`px-6 py-3 rounded-full font-steven font-bold transition-all ${
                  sortBy === "projects"
                    ? 'bg-vintage-brown text-vintage-beige-light shadow-lg'
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border-2 border-vintage-brown-light'
                }`}
              >
                [Code] Most Projects
              </button>
            </div>

            <div className="text-vintage-brown font-steven">
              {filteredMakers.length} makers
            </div>
          </div>
        </div>
      </section>

      {/* Makers Grid */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {filteredMakers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4"></div>
              <h3 className="font-national-park text-3xl text-vintage-dark mb-3">
                No makers found
              </h3>
              <p className="font-steven text-vintage-brown">
                Try adjusting your search
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMakers.map((maker, index) => (
                <motion.div
                  key={maker.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="organic-card hover:scale-[1.02] transition-transform"
                >
                  {/* Rank Badge */}
                  {maker.rank && maker.rank <= 10 && (
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                      maker.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      maker.rank === 2 ? 'bg-gray-300 text-gray-800' :
                      maker.rank === 3 ? 'bg-orange-400 text-orange-900' :
                      'bg-vintage-brown-light text-vintage-beige-light'
                    }`}>
                      {maker.rank === 1 && ''}
                      {maker.rank === 2 && ''}
                      {maker.rank === 3 && ''}
                      {' '}Rank #{maker.rank}
                    </div>
                  )}

                  {/* Avatar & Basic Info */}
                  <div className="text-center mb-4">
                    <Image
                      src={maker.avatar || ''}
                      alt={maker.username}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-vintage-brown mx-auto mb-4"
                    />
                    <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-1">
                      {maker.username}
                    </h3>
                    {maker.full_name && (
                      <p className="font-steven text-vintage-brown mb-2">
                        {maker.full_name}
                      </p>
                    )}
                    {maker.location && (
                      <p className="text-sm text-vintage-brown">
                         {maker.location}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  {maker.bio && (
                    <p className="font-steven text-sm text-vintage-dark mb-4 line-clamp-3 text-center italic">
                      "{maker.bio}"
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-vintage-beige rounded-lg">
                      <div className="text-xl font-bold text-vintage-brown">
                        {maker.projects_count}
                      </div>
                      <div className="text-xs text-vintage-dark font-steven">
                        Projects
                      </div>
                    </div>
                    <div className="text-center p-2 bg-vintage-beige rounded-lg">
                      <div className="text-xl font-bold text-vintage-brown">
                        {maker.total_hours_worked}h
                      </div>
                      <div className="text-xs text-vintage-dark font-steven">
                        Hours
                      </div>
                    </div>
                    <div className="text-center p-2 bg-vintage-beige rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Image 
                          src="/images/shell.png" 
                          alt="Shell" 
                          width={16} 
                          height={16}
                        />
                        <span className="text-xl font-bold text-vintage-brown">
                          {Math.floor(maker.shells_earned / 1000)}k
                        </span>
                      </div>
                      <div className="text-xs text-vintage-dark font-steven">
                        Shells
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  {maker.badges && maker.badges.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-vintage-brown font-steven mb-2 text-center">
                        Badges
                      </div>
                      <div className="flex justify-center gap-2 flex-wrap">
                        {maker.badges.map(badge => (
                          <span
                            key={badge.id}
                            className="text-2xl"
                            title={badge.name}
                          >
                            {badge.icon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-2">
                    {maker.github_username && (
                      <a
                        href={`https://github.com/${maker.github_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-vintage-brown text-vintage-beige-light px-4 py-2 rounded-full font-steven text-sm font-bold hover:bg-vintage-brown-dark transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {maker.website && (
                      <a
                        href={maker.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-vintage-brown-light text-vintage-beige-light px-4 py-2 rounded-full font-steven text-sm font-bold hover:bg-vintage-brown transition-colors"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-12 px-6 md:px-12 bg-vintage-tan">
        <div className="max-w-5xl mx-auto">
          <h2 className="newspaper-heading text-center mb-8">
            Community Impact
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="organic-card text-center">
              <div className="text-4xl mb-3"></div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {new Set(users.map(u => u.location).filter(Boolean)).size}
              </div>
              <div className="font-steven text-vintage-dark">Countries</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-3">[Hot]</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {Math.round(users.reduce((acc, u) => acc + u.total_sessions, 0) / users.length)}
              </div>
              <div className="font-steven text-vintage-dark">Avg Sessions</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {Math.round(users.reduce((acc, u) => acc + u.total_hours_worked, 0) / users.length)}h
              </div>
              <div className="font-steven text-vintage-dark">Avg Hours</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-4xl mb-3"></div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {users.reduce((acc, u) => acc + (u.badges?.length || 0), 0)}
              </div>
              <div className="font-steven text-vintage-dark">Total Badges</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
