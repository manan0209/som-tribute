# Summer of Making 2025 - A Tribute

A personal tribute to Hack Club's Summer of Making 2025. This project celebrates the incredible makers, projects, and community that made SOM 2025 unforgettable.

**Live Site:** [https://somwrapup.vercel.app/](https://somwrapup.vercel.app/)

## About This Project

This is my tribute to Summer of Making, built with real data from the SOM platform. The site features a retro magazine aesthetic that captures the creative spirit of the program.

### Current Status

**Completed:**
- **Leaderboard**: Fully functional with blazing fast search, real user data, accurate shell calculations, and detailed user profiles
- **Projects**: Complete project gallery with indexed search, pagination, and real project data from 9,553+ submissions
- **Homepage**: Landing page with featured content and overview statistics

**In Progress:**
- **Casino**: Shell casino game exists but is not fully built as originally intended
- **Timeline**: Still working on putting together a comprehensive SOM timeline with real events

**Note**: Shipping this for Siege as I'm currently dealing with a cold, but I'm committed to completing the timeline and casino features in the near future.

## Tech Stack

- Next.js 15.5.4 with App Router
- TypeScript
- Tailwind CSS v3
- Framer Motion
- Real data integration from Summer of Making API

## Data Sources

This project fetches real data from the official Summer of Making API:

**API Endpoint:** `https://summer.hackclub.com/api/v1`

**Data Fetched:**
- `/leaderboard` - User rankings and shell accounts (1,989 users)
- `/projects` - All SOM projects with metadata (9,553 projects)
- `/devlogs` - Project development logs (28,820+ devlogs)
- `/users` - User profiles, badges, and achievements
- `/comments` - Community comments on projects

All data is pre-fetched and stored locally in JSON files for optimal performance. The data includes complete transaction histories, accurate shell calculations, and comprehensive project information.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:3000 to view the site.

## Features

### Leaderboard
- Real-time rankings by shells earned, hours worked, and projects shipped
- Blazing fast indexed search across 1,500+ users
- Accurate shell calculations (total earned vs current balance)
- Detailed user profiles with transaction history and badges
- Visual podium for top 3 makers

### Projects Gallery
- 9,553+ real projects from Summer of Making
- Word-based indexed search for instant results
- Pagination for optimal performance
- Featured projects showcase
- Direct links to original SOM project pages

### Homepage
- Overview statistics and featured content
- Magazine-style layout with retro aesthetic
- Quick navigation to all sections

## Project Structure

```
som-tribute/
├── app/                    # Next.js pages
│   ├── page.tsx           # Homepage
│   ├── leaderboard/       # Rankings and user profiles
│   ├── projects/          # Project gallery
│   ├── casino/            # Casino game (WIP)
│   └── timeline/          # Timeline (WIP)
├── components/            # React components
├── data/                  # JSON data files
├── lib/                   # Utilities and helpers
├── public/                # Static assets
├── fetch-all-data.js      # Script to fetch data from API
└── fetch-shells-data.js   # Script to fetch shell data
```

## Design

The site features a vintage magazine aesthetic with:
- Warm beige and brown color palette
- Custom fonts from SOM assets
- Organic card layouts
- Paper textures and retro styling
- Smooth animations

## Acknowledgments

Built as a tribute to Summer of Making 2025 and the incredible Hack Club community. Thank you to all the makers who participated and made this summer special.

Data sourced from the official Summer of Making platform.
