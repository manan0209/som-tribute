"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import timelineEvents from "@/data/timeline-events.json";
import sampleUsers from "@/data/sample-users.json";
import sampleProjects from "@/data/sample-projects.json";
import type { TimelineEvent } from "@/types";

export default function TimelinePage() {
  const [filter, setFilter] = useState<string>("all");
  
  const events = timelineEvents as TimelineEvent[];
  
  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(e => e.type === filter);

  const filters = [
    { value: "all", label: "All Events", icon: "" },
    { value: "project", label: "Projects", icon: "[Code]" },
    { value: "milestone", label: "Milestones", icon: "[Target]" },
    { value: "announcement", label: "Announcements", icon: "" },
    { value: "achievement", label: "Achievements", icon: "" },
    { value: "purchase", label: "Purchases", icon: "" },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "project": return "bg-blue-100 border-blue-400";
      case "milestone": return "bg-yellow-100 border-yellow-500";
      case "announcement": return "bg-purple-100 border-purple-400";
      case "achievement": return "bg-green-100 border-green-500";
      case "purchase": return "bg-pink-100 border-pink-400";
      default: return "bg-vintage-beige-light border-vintage-brown";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
            The Timeline
          </h1>
          <p className="font-steven text-xl md:text-2xl text-vintage-brown">
            A chronological journey through Summer of Making 2025
          </p>
        </div>
      </header>

      {/* Filters */}
      <section className="py-8 px-6 md:px-12 bg-vintage-tan sticky top-0 z-10 border-b-2 border-vintage-brown">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`
                  px-6 py-3 rounded-full font-steven font-bold transition-all
                  ${filter === f.value 
                    ? 'bg-vintage-brown text-vintage-beige-light shadow-lg scale-105' 
                    : 'bg-vintage-beige-light text-vintage-dark hover:bg-vintage-beige border-2 border-vintage-brown-light'
                  }
                `}
              >
                <span className="mr-2">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-vintage-brown-light transform md:-translate-x-1/2" />

            {/* Events */}
            <div className="space-y-12">
              {filteredEvents.map((event, index) => {
                const user = event.user_id ? sampleUsers.find(u => u.id === event.user_id) : null;
                const project = event.project_id ? sampleProjects.find(p => p.id === event.project_id) : null;
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-vintage-brown border-4 border-vintage-beige rounded-full transform -translate-x-1/2 z-10">
                      <div className="absolute inset-0 bg-vintage-brown rounded-full animate-ping opacity-75" />
                    </div>

                    {/* Content */}
                    <div className={`w-full md:w-[calc(50%-3rem)] ml-20 md:ml-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className={`organic-card ${getEventColor(event.type)} hover:scale-[1.02] transition-transform`}>
                        {/* Date Badge */}
                        <div className="inline-block bg-vintage-brown text-vintage-beige-light px-4 py-1 rounded-full text-sm font-steven font-bold mb-3">
                          {formatDate(event.date)}
                        </div>

                        {/* Icon */}
                        <div className="text-5xl mb-3">{event.icon}</div>

                        {/* Title */}
                        <h3 className="font-national-park text-2xl md:text-3xl font-bold text-vintage-dark mb-3">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="font-steven text-vintage-dark mb-4">
                          {event.description}
                        </p>

                        {/* User Info */}
                        {user && (
                          <div className="flex items-center gap-3 mb-4 p-3 bg-vintage-beige rounded-lg">
                            <Image
                              src={user.avatar || ''}
                              alt={user.username}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-vintage-brown"
                            />
                            <div>
                              <div className="font-steven font-bold text-vintage-dark">
                                {user.username}
                              </div>
                              <div className="text-sm text-vintage-brown">
                                Rank #{user.rank}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Project Link */}
                        {project && (
                          <Link 
                            href={`/projects/${project.id}`}
                            className="inline-block text-vintage-brown hover:text-vintage-dark font-bold transition-colors"
                          >
                            View Project →
                          </Link>
                        )}

                        {/* Metadata */}
                        {event.metadata && (
                          <div className="mt-4 pt-4 border-t-2 border-vintage-brown-light">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {Object.entries(event.metadata).map(([key, value]) => (
                                <div key={key}>
                                  <div className="text-vintage-brown font-steven capitalize">
                                    {key.replace(/_/g, ' ')}
                                  </div>
                                  <div className="font-bold text-vintage-dark">
                                    {typeof value === 'number' ? value.toLocaleString() : value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Image */}
                        {event.image && (
                          <div className="mt-4">
                            <Image
                              src={event.image}
                              alt={event.title}
                              width={400}
                              height={300}
                              className="w-full h-auto rounded-lg border-2 border-vintage-brown-light"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* End Marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: filteredEvents.length * 0.05 }}
            className="relative mt-12 text-center"
          >
            <div className="absolute left-8 md:left-1/2 w-12 h-12 bg-vintage-brown border-4 border-vintage-beige rounded-full transform -translate-x-1/2 flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-20 md:ml-0 pt-4">
              <p className="font-steven text-xl text-vintage-brown italic">
                What an incredible journey! 
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 md:px-12 bg-vintage-tan">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="newspaper-heading mb-6">
            Want to See the Projects?
          </h2>
          <p className="article-text mb-8">
            Explore all the incredible projects that made this summer unforgettable.
          </p>
          <Link href="/projects" className="marble-button text-lg px-12 py-4">
            View All Projects →
          </Link>
        </div>
      </section>
    </div>
  );
}
