import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');

function readJson<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export type User = {
  id: string;
  email: string;
  name: string;
  studentId: string | null;
  department: string;
  enrollYear: number | null;
  lcId: string | null;
  role: 'student' | 'admin' | 'moderator';
  profileImage: string;
  title: string | null;
  cumulativePoints: number;
  availablePoints: number;
  createdAt: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  coverImage: string;
  description: string;
  inLibrary: boolean;
  loanUrl: string | null;
  createdAt: string;
};

export type Moderator = {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  department: string;
  enrollYear: number;
  achievement: string;
};

export type BookClub = {
  id: string;
  title: string;
  month: string;
  moderatorId: string;
  bookId: string;
  description: string;
  capacity: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  discussDate: string;
  discussLocation: string;
  status: 'recruiting' | 'active' | 'completed';
  createdAt: string;
};

export type NarrationData = {
  current: {
    id: string;
    month: string;
    bookId: string;
    section: string;
    pageRange: string;
    description: string;
    deadline: string;
    totalParticipants: number;
    currentParticipants: number;
    status: string;
    createdAt: string;
  };
  submissions: Array<{
    id: string;
    narrationId: string;
    userId: string;
    section: string;
    audioUrl: string;
    duration: number;
    status: string;
    createdAt: string;
  }>;
  archive: Array<{
    id: string;
    month: string;
    bookId: string;
    title: string;
    section: string;
    totalParticipants: number;
    audioUrl: string;
    duration: number;
    publishedAt: string;
  }>;
};

export type Writing = {
  id: string;
  userId: string;
  bookTitle: string;
  bookAuthor: string;
  excerpt: string;
  imageUrl: string;
  comment: string | null;
  likes: number;
  isBanner: boolean;
  createdAt: string;
};

export type Review = {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  title: string;
  content: string;
  summary: string;
  likes: number;
  isExcellent: boolean;
  createdAt: string;
};

export type PointRecord = {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'spend';
  zone: string | null;
  description: string;
  balanceAfter: number;
  createdAt: string;
};

export type Badge = {
  id: string;
  userId: string;
  zone: string;
  earnedAt: string;
};

export type MallProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  category: string;
  status: string;
};

export type MallOrder = {
  id: string;
  userId: string;
  productId: string;
  pointsSpent: number;
  status: string;
  createdAt: string;
};

export type LC = {
  id: string;
  name: string;
  year: number;
  memberIds: string[];
};

export type Comment = {
  id: string;
  userId: string;
  targetType: string;
  targetId: string;
  content: string;
  createdAt: string;
};

export type Like = {
  id: string;
  userId: string;
  targetType: string;
  targetId: string;
  createdAt: string;
};

export type EmotionBookMapping = {
  id: string;
  emotionKeywords: string[];
  mood: string;
  bookId: string;
  excerpt: string;
  page: string;
};

export type ListeningRecord = {
  id: string;
  userId: string;
  songTitle: string;
  songArtist: string;
  youtubeUrl: string;
  lyrics: string;
  emotions: string[];
  mood: string;
  matchedBookExcerpts: Array<{ bookId: string; excerpt: string; page: string }>;
  createdAt: string;
};

export type PointRule = {
  id: string;
  zone: string;
  activity: string;
  points: number;
  description: string;
};

export type ListeningResponse = {
  trigger: { keywords: string[] };
  analysis: {
    emotionKeywords: string[];
    mood: string;
    emotionClass: string;
    description: string;
  };
  mappingIds: string[];
};

export type ListeningResponseData = {
  responses: ListeningResponse[];
  defaultResponse: {
    analysis: {
      emotionKeywords: string[];
      mood: string;
      emotionClass: string;
      description: string;
    };
    mappingIds: string[];
  };
};

export const db = {
  users: () => readJson<User[]>('users.json'),
  books: () => readJson<Book[]>('books.json'),
  moderators: () => readJson<Moderator[]>('moderators.json'),
  bookclubs: () => readJson<BookClub[]>('bookclubs.json'),
  narrations: () => readJson<NarrationData>('narrations.json'),
  writings: () => readJson<Writing[]>('writings.json'),
  reviews: () => readJson<Review[]>('reviews.json'),
  points: () => readJson<PointRecord[]>('points.json'),
  badges: () => readJson<Badge[]>('badges.json'),
  mallProducts: () => readJson<MallProduct[]>('mall-products.json'),
  mallOrders: () => readJson<MallOrder[]>('mall-orders.json'),
  lcs: () => readJson<LC[]>('lcs.json'),
  comments: () => readJson<Comment[]>('comments.json'),
  likes: () => readJson<Like[]>('likes.json'),
  emotionMappings: () => readJson<EmotionBookMapping[]>('emotion-book-mappings.json'),
  listenings: () => readJson<ListeningRecord[]>('listenings.json'),
  pointRules: () => readJson<PointRule[]>('point-rules.json'),
  listeningResponses: () => readJson<ListeningResponseData>('listening-responses.json'),
};
