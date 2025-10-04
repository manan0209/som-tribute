"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import projectsData from "@/data/som-projects.json";
import usersData from "@/data/som-users.json";

const projects = projectsData as any[];
const usersObj = usersData as Record<string, any>;

// Convert users object to lookup by slack_id
const usersBySlackId = Object.values(usersObj).reduce((acc: any, user: any) => {
  acc[user.slack_id] = user;
  return acc;
}, {});

// Create indexed search data structure for blazing fast search
const createSearchIndex = () => {
  const index: Record<string, any[]> = {};
  
  projects.forEach((project: any) => {
    const user = usersBySlackId[project.slack_id];
    const searchText = [
      project.title,
      project.description?.replace(/<[^>]*>/g, ''),
      project.category,
      user?.display_name,
      user?.slack_display_name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // Index by words for instant lookup
    const words = searchText.split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) {
        if (!index[word]) index[word] = [];
        if (!index[word].includes(project.id)) {
          index[word].push(project.id);
        }
      }
    });
  });
  
  return index;
};

const searchIndex = createSearchIndex();

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "hours" | "devlogs">("devlogs");
  const [displayLimit, setDisplayLimit] = useState(24); // Show only 24 initially (3 rows)

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    projects.forEach((p: any) => {
      if (p.category) categories.add(p.category);
    });
    return Array.from(categories).sort();
  }, []);

  // Blazing fast indexed search
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Fast indexed search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const queryWords = query.split(/\s+/).filter(w => w.length > 2);
      
      if (queryWords.length > 0) {
        // Get project IDs that match any search word
        const matchingIds = new Set<number>();
        queryWords.forEach(word => {
          // Find all indexed words that start with the search word
          Object.keys(searchIndex).forEach(indexedWord => {
            if (indexedWord.startsWith(word)) {
              searchIndex[indexedWord].forEach(id => matchingIds.add(id));
            }
          });
        });
        
        // Filter to only matching projects
        filtered = filtered.filter(p => matchingIds.has(p.id));
        
        // Fallback to full-text search if indexed search returns nothing
        if (filtered.length === 0) {
          filtered = projects.filter((p: any) => {
            const searchText = [
              p.title,
              p.description?.replace(/<[^>]*>/g, ''),
              p.category,
              usersBySlackId[p.slack_id]?.display_name,
            ].filter(Boolean).join(' ').toLowerCase();
            return searchText.includes(query);
          });
        }
      }
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p: any) => p.category === selectedCategory);
    }

    // Sort
    filtered = [...filtered].sort((a: any, b: any) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "hours":
          return (b.total_seconds_coded || 0) - (a.total_seconds_coded || 0);
        case "devlogs":
          return (b.devlogs_count || 0) - (a.devlogs_count || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Limit displayed projects for performance
  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, displayLimit);
  }, [filteredProjects, displayLimit]);

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
                onClick={() => setSortBy("devlogs")}
                className={`px-4 py-2 rounded-full font-steven transition-all ${
                  sortBy === "devlogs" 
                    ? 'bg-vintage-brown text-vintage-beige-light' 
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige'
                }`}
              >
                Most Devlogs
              </button>
              <button
                onClick={() => setSortBy("hours")}
                className={`px-4 py-2 rounded-full font-steven transition-all ${
                  sortBy === "hours" 
                    ? 'bg-vintage-brown text-vintage-beige-light' 
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige'
                }`}
              >
                Most Hours
              </button>
              <button
                onClick={() => setSortBy("newest")}
                className={`px-4 py-2 rounded-full font-steven transition-all ${
                  sortBy === "newest" 
                    ? 'bg-vintage-brown text-vintage-beige-light' 
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige'
                }`}
              >
                Newest
              </button>
            </div>

            <div className="text-vintage-brown font-steven">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-steven transition-all ${
                selectedCategory === null
                  ? 'bg-vintage-brown text-vintage-beige-light'
                  : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border border-vintage-brown-light'
              }`}
            >
              All Categories
            </button>
            {allCategories.map((category: string) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                className={`px-4 py-2 rounded-full text-sm font-steven transition-all ${
                  selectedCategory === category
                    ? 'bg-vintage-brown text-vintage-beige-light'
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border border-vintage-brown-light'
                }`}
              >
                {category}
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
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProjects.map((project: any) => {
                const user = usersBySlackId[project.slack_id];
                const hours = Math.round((project.total_seconds_coded || 0) / 3600);
                
                return (
                  <div
                    key={project.id}
                    className="organic-card hover:scale-[1.02] transition-transform cursor-pointer"
                    onClick={() => window.open(`https://summer.hackclub.com/projects/${project.id}`, '_blank')}
                  >
                    {/* User Info - Text Only for Performance */}
                    {user && (
                      <div className="mb-4">
                        <div className="font-steven font-bold text-vintage-dark">
                          by {user.display_name || user.slack_id}
                        </div>
                        <div className="text-sm text-vintage-brown">
                          {user.projects_count || 0} projects
                        </div>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-3 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="font-steven text-vintage-dark mb-4 line-clamp-3">
                      {project.description?.replace(/<[^>]*>/g, '') || 'An amazing Summer of Making project!'}
                    </p>

                    {/* Category */}
                    {project.category && (
                      <div className="mb-4">
                        <span className="text-xs bg-vintage-tan px-3 py-1 rounded-full border border-vintage-brown-light font-steven">
                          {project.category}
                        </span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 bg-vintage-beige rounded-lg">
                        <div className="text-2xl font-bold text-vintage-brown">
                          {hours}h
                        </div>
                        <div className="text-xs text-vintage-dark font-steven">
                          Time Spent
                        </div>
                      </div>
                      <div className="text-center p-2 bg-vintage-beige rounded-lg">
                        <div className="text-2xl font-bold text-vintage-brown">
                          {project.devlogs_count || 0}
                        </div>
                        <div className="text-xs text-vintage-dark font-steven">
                          Devlogs
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {project.repo_link && (
                        <a
                          href={project.repo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-vintage-brown text-vintage-beige-light px-4 py-2 rounded-full font-steven font-bold hover:bg-vintage-brown-dark transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          GitHub
                        </a>
                      )}
                      {project.demo_link && (
                        <a
                          href={project.demo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-vintage-brown-light text-vintage-beige-light px-4 py-2 rounded-full font-steven font-bold hover:bg-vintage-brown transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Demo
                        </a>
                      )}
                      {!project.repo_link && !project.demo_link && project.readme_link && (
                        <a
                          href={project.readme_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-vintage-brown-light text-vintage-beige-light px-4 py-2 rounded-full font-steven font-bold hover:bg-vintage-brown transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          README
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Load More Button */}
            {displayedProjects.length < filteredProjects.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 24)}
                  className="px-8 py-4 bg-vintage-brown text-vintage-beige-light rounded-full font-steven text-lg font-bold hover:bg-vintage-brown-dark transition-colors"
                >
                  Load More Projects ({filteredProjects.length - displayedProjects.length} remaining)
                </button>
              </div>
            )}
          </>
          )}
        </div>
      </section>
    </div>
  );
}
