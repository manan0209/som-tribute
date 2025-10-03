"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import projectsData from "@/data/som-projects.json";
import usersData from "@/data/som-users.json";
import shellsData from "@/data/som-shells.json";

const projects = projectsData as any[];
const usersObj = usersData as Record<string, any>;
const usersArray = Object.values(usersObj);
const shellsArray = shellsData as Array<any>;


const usersBySlackId = usersArray.reduce((acc: any, user: any) => {
  acc[user.slack_id] = user;
  return acc;
}, {});

// Check if user is banned (has activity but 0 projects)
const isBannedUser = (user: any) => {
  const projectsCount = user.projects_count || 0;
  const devlogsCount = user.devlogs_count || 0;
  
  return projectsCount === 0 && devlogsCount > 0;
};

// Check if user is inactive (0 projects AND 0 devlogs - skip completely)
const isInactiveUser = (user: any) => {
  const projectsCount = user.projects_count || 0;
  const devlogsCount = user.devlogs_count || 0;
  
  return projectsCount === 0 && devlogsCount === 0;
};

// Check if user is admin (has admin badge)
const isAdminUser = (user: any) => {
  return user.badges && user.badges.some((badge: any) => 
    badge.name === "<%= admin_tool do %>"
  );
};

// Filter out inactive users, keep valid and banned users
const activeUsers = usersArray.filter((u: any) => !isInactiveUser(u));
const validUsers = activeUsers.filter((u: any) => !isBannedUser(u));

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  
  const featuredProjects = projects
    .filter(p => {
      const user = usersBySlackId[p.slack_id];
      return p.devlogs_count > 5 && p.description && user && !isBannedUser(user);
    })
    .sort((a, b) => b.devlogs_count - a.devlogs_count)
    .slice(0, 6);
  
  // Get top makers by shells earned (show all including banned, but banned go to bottom, skip inactive)
  const topMakers = shellsArray
    .filter(s => {
      const user = usersBySlackId[s.slack_id];
      return user && !isInactiveUser(user); // Skip inactive users
    })
    .sort((a, b) => {
      const userA = usersBySlackId[a.slack_id];
      const userB = usersBySlackId[b.slack_id];
      const bannedA = isBannedUser(userA);
      const bannedB = isBannedUser(userB);
      
      // Banned users go to bottom
      if (bannedA && !bannedB) return 1;
      if (!bannedA && bannedB) return -1;
      
      // Sort by shells earned
      return (b.total_shells_earned || 0) - (a.total_shells_earned || 0);
    })
    .slice(0, 5)
    .map(shell => ({
      ...usersBySlackId[shell.slack_id],
      shells_earned: shell.total_shells_earned,
      current_shells: shell.current_shells
    }));

  // Calculate total stats (exclude banned users)
  const totalHours = Math.round(
    validUsers.reduce((acc: number, u: any) => acc + (u.coding_time_seconds || 0), 0) / 3600
  );
  const totalShellsEarned = shellsArray
    .filter(s => {
      const user = usersBySlackId[s.slack_id];
      return user && !isBannedUser(user);
    })
    .reduce((acc: number, s: any) => acc + (s.total_shells_earned || 0), 0);
  const totalDevlogs = validUsers.reduce((acc: number, u: any) => acc + (u.devlogs_count || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Masthead with Animation */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="border-b-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light"
      >
        <div className="max-w-7xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-4">
            <h1 className="masthead text-6xl md:text-8xl lg:text-9xl mb-2">
              Summer of Making
            </h1>
            <p className="masthead-subtitle text-2xl md:text-3xl">
              The Ultimate Wrap-Up Edition
            </p>
          </div>

          {/* Publication Info */}
          <div className="flex justify-between items-center text-sm md:text-base text-vintage-brown border-t-2 border-b-2 border-vintage-brown py-2 mt-6">
            <div className="font-steven italic">Vol. 1, No. 1</div>
            <div className="font-steven font-bold">Special Commemorative Issue</div>
            <div className="font-steven italic">August 2025</div>
          </div>

          {/* Tagline */}
          <div className="text-center mt-4">
            <p className="font-steven text-lg md:text-xl text-vintage-dark">
              A Chronicle of Makers, Projects, and Shell Economics
            </p>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Animations */}
      <section className="py-12 px-6 md:px-12 bg-vintage-beige">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Orpheus Image */}
            <div className="relative">
              <div className="organic-card bg-vintage-tan">
                <Image
                  src="/images/orph_wow_prizes.png"
                  alt="Orpheus with prizes"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg"
                  priority
                />
                <p className="handwritten text-center mt-4 text-xl">
                  "The best summer ever!" - Orpheus
                </p>
              </div>
            </div>

            {/* Right: Stats & Intro */}
            <div>
              <h2 className="newspaper-heading mb-6">
                The Summer That Changed Everything
              </h2>
              <div className="article-text space-y-4 mb-8">
                <p>
                  This summer, hundreds of makers from around the world came together to build, 
                  create, and ship incredible projects. Armed with nothing but laptops, creativity, 
                  and an unhealthy obsession with shell currency, they made magic happen.
                </p>
                <p>
                  From AI-powered dinosaur assistants to smart home dashboards built from scratch, 
                  the projects showcase the boundless creativity and technical prowess of Hack Club's 
                  makers.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="organic-card text-center"
                >
                  <div className="text-4xl font-bold text-vintage-brown mb-2">
                    {projects.length.toLocaleString()}
                  </div>
                  <div className="font-steven text-vintage-dark">Projects Built</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="organic-card text-center"
                >
                  <div className="text-4xl font-bold text-vintage-brown mb-2">
                    {totalHours.toLocaleString()}
                  </div>
                  <div className="font-steven text-vintage-dark">Hours Worked</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="organic-card text-center"
                >
                  <div className="text-4xl font-bold text-vintage-brown mb-2">
                    {Math.round(totalShellsEarned).toLocaleString()}
                  </div>
                  <div className="font-steven text-vintage-dark">Shells Earned</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="organic-card text-center"
                >
                  <div className="text-4xl font-bold text-vintage-brown mb-2">
                    {usersArray.length.toLocaleString()}
                  </div>
                  <div className="font-steven text-vintage-dark">Amazing Makers</div>
                </motion.div>
              </div>

              <div className="mt-8">
                <Link href="/timeline" className="marble-button inline-block">
                  Explore the Timeline →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="newspaper-heading mb-4">Featured Projects</h2>
            <div className="divider-ornament">
              <span className="text-4xl">*</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map((project: any, index: number) => {
              const user = usersBySlackId[project.slack_id];
              return (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className="organic-card relative overflow-hidden"
                >
                  {hoveredProject === project.id && (
                    <motion.div
                      layoutId="highlight"
                      className="absolute inset-0 bg-vintage-tan opacity-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  
                  <div className="relative z-10">
                    {/* User info */}
                    {user && (
                      <div className="flex items-center gap-2 mb-3">
                        {user.avatar && (
                          <Image
                            src={user.avatar}
                            alt={user.display_name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full border-2 border-vintage-brown"
                          />
                        )}
                        <span className="font-steven text-sm text-vintage-brown">
                          by {user.display_name || user.slack_id}
                        </span>
                      </div>
                    )}

                    <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-3">
                      {project.title}
                    </h3>

                    <p className="font-steven text-vintage-dark mb-4 line-clamp-3">
                      {project.description?.replace(/<[^>]*>/g, '') || 'An amazing Summer of Making project!'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-vintage-tan rounded text-xs font-steven">
                        {project.category}
                      </span>
                      <span className="px-2 py-1 bg-vintage-beige rounded text-xs font-steven">
                        {project.devlogs_count} devlogs
                      </span>
                      <span className="px-2 py-1 bg-vintage-beige rounded text-xs font-steven">
                        {Math.round((project.total_seconds_coded || 0) / 3600)}h coded
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {project.repo_link && (
                        <a 
                          href={project.repo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vintage-brown hover:text-vintage-dark font-bold transition-colors text-sm"
                        >
                          View Code →
                        </a>
                      )}
                      {project.demo_link && (
                        <a 
                          href={project.demo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vintage-brown hover:text-vintage-dark font-bold transition-colors text-sm"
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects" className="marble-button">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Stats Section */}
      <section className="py-16 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="newspaper-heading mb-4">By the Numbers</h2>
            <p className="font-steven text-xl text-vintage-brown">
              A summer worth celebrating
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="organic-card text-center bg-gradient-to-br from-vintage-beige to-vintage-tan"
            >
              <div className="flex justify-center mb-3">
                <Image
                  src="/images/icon.svg"
                  alt="Projects"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px]"
                />
              </div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {projects.length.toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Projects Shipped</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, rotate: -1 }}
              className="organic-card text-center bg-gradient-to-br from-vintage-beige to-vintage-tan"
            >
              <div className="flex justify-center mb-3">
                <Image
                  src="/images/icon.svg"
                  alt="Devlogs"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px]"
                />
              </div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {totalDevlogs.toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Devlogs Written</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="organic-card text-center bg-gradient-to-br from-vintage-beige to-vintage-tan"
            >
              <div className="flex justify-center mb-3">
                <Image
                  src="/images/shell.png"
                  alt="Shells"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px]"
                />
              </div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {Math.round(totalShellsEarned).toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Shells Earned</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, rotate: -1 }}
              className="organic-card text-center bg-gradient-to-br from-vintage-beige to-vintage-tan"
            >
              <div className="flex justify-center mb-3">
                <Image
                  src="/images/orpheusyap1.png"
                  alt="Makers"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] rounded-full"
                />
              </div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {validUsers.length.toLocaleString()}
              </div>
              <div className="font-steven text-vintage-dark">Incredible Makers</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Makers Leaderboard Preview */}
      <section className="py-16 px-6 md:px-12 bg-vintage-beige">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="newspaper-heading mb-4">Top Makers</h2>
            <p className="font-steven text-xl text-vintage-brown">
              The makers who went above and beyond
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {topMakers.map((user: any, index: number) => {
              const banned = isBannedUser(user);
              const admin = isAdminUser(user);
              return (
              <motion.div 
                key={user.slack_id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className={`organic-card mb-4 cursor-pointer ${
                  banned ? 'bg-red-50 border-red-300' : 
                  admin ? 'bg-pink-50 border-pink-300' : ''
                }`}
              >
                <Link href="/leaderboard" className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="text-center min-w-[60px] flex justify-center items-center">
                    {banned ? (
                      <div className="text-xl font-bold text-red-600 text-center">
                        BANNED
                      </div>
                    ) : admin ? (
                      <div className="text-xl font-bold text-pink-600 text-center">
                        ADMIN
                      </div>
                    ) : index === 0 ? (
                      <Image src="/images/trophy.svg" alt="1st Place" width={48} height={48} className="filter brightness-110 saturate-150" style={{filter: 'hue-rotate(25deg)'}} />
                    ) : index === 1 ? (
                      <Image src="/images/trophy.svg" alt="2nd Place" width={48} height={48} className="filter grayscale brightness-125" />
                    ) : index === 2 ? (
                      <Image src="/images/trophy.svg" alt="3rd Place" width={48} height={48} className="filter brightness-110" style={{filter: 'hue-rotate(-15deg) saturate(1.3)'}} />
                    ) : (
                      <div className="text-5xl font-bold font-national-park text-vintage-brown">
                        #{index + 1}
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  {user.avatar && (
                    <Image
                      src={user.avatar}
                      alt={user.display_name || 'User'}
                      width={64}
                      height={64}
                      className={`rounded-full border-4 ${
                        banned ? 'border-red-500 opacity-60' :
                        admin ? 'border-pink-500' :
                        index === 0 ? 'border-yellow-500' :
                        index === 1 ? 'border-gray-400' :
                        index === 2 ? 'border-orange-500' :
                        'border-vintage-brown'
                      }`}
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <div className={`font-national-park text-2xl font-bold ${
                      banned ? 'text-red-700' : 
                      admin ? 'text-pink-700' :
                      'text-vintage-dark'
                    }`}>
                      {user.display_name || user.slack_id}
                    </div>
                    <div className="font-steven text-vintage-brown">
                      {user.projects_count} projects • {Math.round((user.coding_time_seconds || 0) / 3600)}h coded
                    </div>
                  </div>

                  {/* Shells */}
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      banned ? 'text-red-600' :
                      admin ? 'text-pink-600' :
                      'text-vintage-brown'
                    }`}>
                      {Math.round(user.shells_earned).toLocaleString()}
                    </div>
                    <div className="text-sm font-steven text-vintage-brown-light">
                      shells earned
                    </div>
                  </div>
                </Link>
              </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/leaderboard" className="marble-button">
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action - Casino */}
      <section className="py-16 px-6 md:px-12 bg-vintage-tan">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="organic-card bg-vintage-beige-light"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex justify-center mb-4"
            >
              <Image src="/images/shellcoinv2.png" alt="Shell Casino" width={80} height={80} />
            </motion.div>
            <h2 className="newspaper-heading mb-4">
              Try Your Luck at the Shell Casino
            </h2>
            <p className="article-text mb-8">
              Put your hard-earned shells to the test! Play slots, roulette, and more 
              in our simulated casino. All earnings are virtual, all fun is real.
            </p>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/casino" className="marble-button text-lg px-12 py-4">
                Enter Casino
              </Link>
            </motion.div>
            <p className="text-sm text-vintage-brown mt-4 font-steven italic">
              *This is a simulation. No real shells were harmed in the making of this casino.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-national-park text-xl font-bold text-vintage-dark mb-3">
                Explore
              </h3>
              <ul className="font-steven space-y-2">
                <li><Link href="/timeline" className="hover:text-vintage-brown transition-colors">Timeline</Link></li>
                <li><Link href="/projects" className="hover:text-vintage-brown transition-colors">Projects</Link></li>
                <li><Link href="/makers" className="hover:text-vintage-brown transition-colors">Makers</Link></li>
                <li><Link href="/leaderboard" className="hover:text-vintage-brown transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-national-park text-xl font-bold text-vintage-dark mb-3">
                Fun Stuff
              </h3>
              <ul className="font-steven space-y-2">
                <li><Link href="/casino" className="hover:text-vintage-brown transition-colors">Shell Casino</Link></li>
                <li><Link href="/shop" className="hover:text-vintage-brown transition-colors">Shell Shop</Link></li>
                <li><Link href="/stats" className="hover:text-vintage-brown transition-colors">Statistics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-national-park text-xl font-bold text-vintage-dark mb-3">
                About
              </h3>
              <ul className="font-steven space-y-2">
                <li><a href="https://hackclub.com" target="_blank" rel="noopener" className="hover:text-vintage-brown transition-colors">Hack Club</a></li>
                <li><a href="https://github.com/hackclub" target="_blank" rel="noopener" className="hover:text-vintage-brown transition-colors">GitHub</a></li>
                <li><a href="https://hackclub.com/slack" target="_blank" rel="noopener" className="hover:text-vintage-brown transition-colors">Join Slack</a></li>
              </ul>
            </div>
          </div>

          <div className="text-center font-steven text-vintage-brown border-t-2 border-vintage-brown pt-6">
            <p>Made with love by the Hack Club community</p>
            <p className="text-sm mt-2">Summer of Making 2025 • A celebration of makers and making</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
