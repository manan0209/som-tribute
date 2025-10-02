// Core User Types
export interface User {
  id: number;
  slack_id: string;
  username: string;
  email?: string;
  avatar?: string;
  full_name?: string;
  github_username?: string;
  
  // SOM Stats
  shells_balance: number;
  shells_earned: number;
  total_hours_worked: number;
  total_sessions: number;
  projects_count: number;
  
  // Leaderboard Rankings
  rank?: number;
  rank_change?: number; // +3, -1, etc.
  
  // Profile
  bio?: string;
  location?: string;
  website?: string;
  joined_at: string;
  
  // Badges & Achievements
  badges?: Badge[];
  achievements?: Achievement[];
}

// Project Types
export interface Project {
  id: number;
  user_id: number;
  user?: User; // Populated user data
  
  title: string;
  description: string;
  readme?: string;
  
  // Links
  repo_url?: string;
  demo_url?: string;
  screenshots?: string[];
  
  // Session Data
  total_hours: number;
  sessions_count: number;
  shell_value: number;
  
  // Metadata
  tags?: string[];
  technologies?: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  
  // Engagement
  views?: number;
  likes?: number;
  featured?: boolean;
}

// Session Types
export interface Session {
  id: number;
  user_id: number;
  project_id?: number;
  
  work: string;
  hours_worked: number;
  shells_earned: number;
  
  screenshot_url?: string;
  created_at: string;
  approved: boolean;
  approved_at?: string;
}

// Shop & Items
export interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  
  image_url?: string;
  category: 'hardware' | 'software' | 'swag' | 'other';
  stock?: number;
  
  created_at: string;
  available: boolean;
}

export interface Purchase {
  id: number;
  user_id: number;
  item_id: number;
  item?: ShopItem;
  
  shells_spent: number;
  quantity: number;
  
  shipping_address?: string;
  tracking_number?: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  
  purchased_at: string;
}

// Timeline & Events
export interface TimelineEvent {
  id: string;
  type: 'project' | 'milestone' | 'purchase' | 'achievement' | 'announcement';
  title: string;
  description?: string;
  
  user_id?: number;
  user?: User;
  
  project_id?: number;
  project?: Project;
  
  date: string;
  icon?: string;
  image?: string;
  
  metadata?: Record<string, any>;
}

// Badges & Achievements
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  
  earned_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  
  progress: number;
  target: number;
  completed: boolean;
  
  reward_shells?: number;
  reward_badge?: Badge;
  
  unlocked_at?: string;
}

// Virtual Wallet & Casino
export interface VirtualWallet {
  user_id: number;
  balance: number;
  
  // Session stats
  total_wagered: number;
  total_won: number;
  total_lost: number;
  net_profit: number;
  
  // Game counts
  games_played: number;
  games_won: number;
  win_rate: number;
  
  // Streaks
  current_win_streak: number;
  best_win_streak: number;
  
  // Limits (for safety)
  daily_limit: number;
  daily_spent: number;
  last_reset_at: string;
}

export interface CasinoGame {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  min_bet: number;
  max_bet: number;
  house_edge: number;
  
  type: 'slots' | 'roulette' | 'blackjack' | 'coinflip' | 'dice';
  available: boolean;
}

export interface GameResult {
  id: string;
  user_id: number;
  game_id: string;
  
  bet_amount: number;
  result: 'win' | 'loss' | 'push';
  payout: number;
  
  game_data?: Record<string, any>;
  played_at: string;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  user: User;
  
  score: number; // Can be shells_earned, hours_worked, etc.
  score_type: 'shells' | 'hours' | 'projects' | 'sessions';
  
  change: number; // Rank change from previous period
  trend: 'up' | 'down' | 'same';
  
  period?: 'all-time' | 'monthly' | 'weekly';
}

// Charts & Analytics
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface StatCard {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
  error?: string;
}

// Filter & Sort Types
export interface ProjectFilters {
  search?: string;
  user_id?: number;
  tags?: string[];
  technologies?: string[];
  min_hours?: number;
  max_hours?: number;
  featured?: boolean;
  sort_by?: 'created_at' | 'updated_at' | 'total_hours' | 'shell_value';
  order?: 'asc' | 'desc';
}

export interface UserFilters {
  search?: string;
  min_shells?: number;
  max_shells?: number;
  min_projects?: number;
  badges?: string[];
  sort_by?: 'shells_earned' | 'total_hours' | 'projects_count' | 'created_at';
  order?: 'asc' | 'desc';
}
