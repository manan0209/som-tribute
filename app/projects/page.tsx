"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import sampleProjects from "@/data/sample-projects.json";
import sampleUsers from "@/data/sample-users.json";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "hours" | "shells">("newest");

  const projects = sampleProjects as Project[];

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(p => p.tags?.includes(selectedTag));
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "hours":
          return b.total_hours - a.total_hours;
        case "shells":
          return b.shell_value - a.shell_value;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchQuery, selectedTag, sortBy]);

  return (
    <div className="min-h-screen bg-vintage-beige">
      {/* Header */}
      <header className="border-b-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-block mb-4 text-vintage-brown hover:text-vintage-dark transition-colors">
            ← Back to Home
          </Link>
          <h1 className="masthead text-5xl md:text-7xl mb-3">
            Project Gallery
          </h1>
          <p className="font-steven text-xl md:text-2xl text-vintage-brown">
            {projects.length} incredible projects built this summer
          </p>
        </div>
      </header>

      {/* Filters & Search */}
      <section className="py-8 px-6 md:px-12 bg-vintage-tan sticky top-0 z-10 border-b-2 border-vintage-brown">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder=" Search projects, technologies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-3 border-vintage-brown bg-vintage-beige-light font-steven text-lg focus:outline-none focus:ring-4 focus:ring-vintage-brown-light"
            />
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-4 py-2 rounded-full font-steven transition-all ${
                  sortBy === "newest" 
                    ? 'bg-vintage-brown text-vintage-beige-light' 
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige'
                }`}
              >
                ⏰ Newest
              </button>
              <button
                onClick={() => setSortBy("hours")}
                className={`px-4 py-2 rounded-full font-steven transition-all ${
                  sortBy === "hours" 
                    ? 'bg-vintage-brown text-vintage-beige-light' 
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige'
                }`}
              >
                ⌛ Most Hours
              </button>
              <button
                onClick={() => setSortBy("shells")}
                className={`px-4 py-2 rounded-full font-steven transition-all ${
                  sortBy === "shells" 
                    ? 'bg-vintage-brown text-vintage-beige-light' 
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige'
                }`}
              >
                 Highest Value
              </button>
            </div>

            <div className="text-vintage-brown font-steven">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-steven transition-all ${
                selectedTag === null
                  ? 'bg-vintage-brown text-vintage-beige-light'
                  : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border border-vintage-brown-light'
              }`}
            >
              All Tags
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm font-steven transition-all ${
                  selectedTag === tag
                    ? 'bg-vintage-brown text-vintage-beige-light'
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border border-vintage-brown-light'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4"></div>
              <h3 className="font-national-park text-3xl text-vintage-dark mb-3">
                No projects found
              </h3>
              <p className="font-steven text-vintage-brown">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => {
                const user = sampleUsers.find(u => u.id === project.user_id);
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="organic-card hover:scale-[1.02] transition-transform"
                  >
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="inline-block bg-yellow-400 text-vintage-dark px-3 py-1 rounded-full text-xs font-bold mb-3">
                        ⭐ FEATURED
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                      {user?.avatar && (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-vintage-brown"
                        />
                      )}
                      <div>
                        <div className="font-steven font-bold text-vintage-dark">
                          {user?.username}
                        </div>
                        <div className="text-sm text-vintage-brown">
                          {project.sessions_count} sessions
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-3 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="font-steven text-vintage-dark mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 4).map(tech => (
                        <span 
                          key={tech}
                          className="text-xs bg-vintage-tan px-3 py-1 rounded-full border border-vintage-brown-light font-steven"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 bg-vintage-beige rounded-lg">
                        <div className="text-2xl font-bold text-vintage-brown">
                          {project.total_hours}h
                        </div>
                        <div className="text-xs text-vintage-dark font-steven">
                          Time Spent
                        </div>
                      </div>
                      <div className="text-center p-2 bg-vintage-beige rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                          <Image 
                            src="/images/shell.png" 
                            alt="Shell" 
                            width={20} 
                            height={20}
                          />
                          <span className="text-2xl font-bold text-vintage-brown">
                            {project.shell_value}
                          </span>
                        </div>
                        <div className="text-xs text-vintage-dark font-steven">
                          Shell Value
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-vintage-brown text-vintage-beige-light px-4 py-2 rounded-full font-steven font-bold hover:bg-vintage-brown-dark transition-colors"
                        >
                          GitHub
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-vintage-brown-light text-vintage-beige-light px-4 py-2 rounded-full font-steven font-bold hover:bg-vintage-brown transition-colors"
                        >
                          Demo
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
