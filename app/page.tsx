import Image from "next/image";
import Link from "next/link";
import sampleUsers from "@/data/sample-users.json";
import sampleProjects from "@/data/sample-projects.json";

export default function Home() {
  // Get featured projects
  const featuredProjects = sampleProjects.filter(p => p.featured).slice(0, 3);
  const topMakers = sampleUsers.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Masthead */}
      <header className="border-b-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light">
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
      </header>

      {/* Hero Section */}
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
                <div className="organic-card text-center">
                  <div className="text-4xl font-bold text-vintage-brown mb-2">
                    {sampleUsers.reduce((acc, u) => acc + u.projects_count, 0)}
                  </div>
                  <div className="font-steven text-vintage-dark">Projects Built</div>
                </div>
                <div className="organic-card text-center">
                  <div className="text-4xl font-bold text-vintage-brown mb-2">
                    {sampleUsers.reduce((acc, u) => acc + u.total_hours_worked, 0).toLocaleString()}
                  </div>
                  <div className="font-steven text-vintage-dark">Hours Worked</div>
                </div>
                <div className="organic-card text-center">
                  <div className="text-4xl font-bold text-vintage-brown mb-2">
                    {sampleUsers.reduce((acc, u) => acc + u.shells_earned, 0).toLocaleString()}
                  </div>
                  <div className="font-steven text-vintage-dark">Shells Earned</div>
                </div>
                <div className="organic-card text-center">
                  <div className="text-4xl font-bold text-vintage-brown mb-2">
                    {sampleUsers.length}
                  </div>
                  <div className="font-steven text-vintage-dark">Amazing Makers</div>
                </div>
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
              <span className="text-4xl">✦</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => {
              const user = sampleUsers.find(u => u.id === project.user_id);
              return (
                <div key={project.id} className="organic-card hover:scale-[1.02] transition-transform">
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
                        {project.total_hours}h worked
                      </div>
                    </div>
                  </div>

                  <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-3">
                    {project.title}
                  </h3>

                  <p className="font-steven text-vintage-dark mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 3).map(tech => (
                      <span 
                        key={tech}
                        className="text-xs bg-vintage-tan px-3 py-1 rounded-full border border-vintage-brown-light"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="shell-badge text-sm">
                      <Image 
                        src="/images/shell.png" 
                        alt="Shell" 
                        width={20} 
                        height={20}
                      />
                      <span className="font-bold">{project.shell_value.toLocaleString()}</span>
                    </div>
                    <Link 
                      href={`/projects/${project.id}`}
                      className="text-vintage-brown hover:text-vintage-dark font-bold transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
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
            {topMakers.map((user, index) => (
              <div 
                key={user.id}
                className="organic-card mb-4 hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="text-center">
                    <div className={`
                      text-4xl font-bold
                      ${index === 0 ? 'text-yellow-600' : ''}
                      ${index === 1 ? 'text-gray-400' : ''}
                      ${index === 2 ? 'text-orange-600' : ''}
                      ${index > 2 ? 'text-vintage-brown' : ''}
                    `}>
                      #{user.rank}
                    </div>
                    {index === 0 && <div className="text-2xl trophy-glow">🏆</div>}
                  </div>

                  {/* Avatar */}
                  <Image
                    src={user.avatar || ''}
                    alt={user.username}
                    width={60}
                    height={60}
                    className="rounded-full border-3 border-vintage-brown"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <div className="font-national-park text-2xl font-bold text-vintage-dark">
                      {user.username}
                    </div>
                    <div className="font-steven text-vintage-brown">
                      {user.projects_count} projects • {user.total_hours_worked}h worked
                    </div>
                  </div>

                  {/* Shells */}
                  <div className="shell-badge">
                    <Image 
                      src="/images/shell.png" 
                      alt="Shell" 
                      width={24} 
                      height={24}
                    />
                    <span className="font-bold text-lg">
                      {user.shells_earned.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
          <div className="organic-card bg-vintage-beige-light">
            <div className="text-6xl mb-4">🎰</div>
            <h2 className="newspaper-heading mb-4">
              Try Your Luck at the Shell Casino
            </h2>
            <p className="article-text mb-8">
              Put your hard-earned shells to the test! Play slots, roulette, and more 
              in our simulated casino. All earnings are virtual, all fun is real.
            </p>
            <Link href="/casino" className="marble-button text-lg px-12 py-4">
              Enter Casino 🎲
            </Link>
            <p className="text-sm text-vintage-brown mt-4 font-steven italic">
              *This is a simulation. No real shells were harmed in the making of this casino.
            </p>
          </div>
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
            <p>Made with 💛 by the Hack Club community</p>
            <p className="text-sm mt-2">Summer of Making 2025 • A celebration of makers and making</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
