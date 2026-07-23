export type EntityId = string;
export type LanguageCode = 'TH';
export type CouponType = 'flat' | 'percent';
export type OrderStatus = 'pending' | 'approved';
export type UserRole = 'guest' | 'student' | 'admin';
export type SlideActionType = 'bundle' | 'course';

export interface BrandColors {
  navy: string;
  navyLight: string;
  sky: string;
  skyLight: string;
  red: string;
  redDark: string;
  page: string;
  white: string;
  textDark: string;
  textMuted: string;
}

export interface Lesson {
  id: EntityId;
  title: string;
  duration: number;
  videoUrl: string;
}

export interface Course {
  id: EntityId;
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  badge: string;
  badgeBg: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  description: string;
  hours: number;
  validity: number;
  ebook: boolean;
  lessons: Lesson[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  /** Preserve the legacy key while importing data; rename to `level` afterward. */
  Level: string;
  /** Preserve the legacy key while importing data; rename to `category` afterward. */
  Category: string;
}

export interface FreeTrial {
  id: EntityId;
  title: string;
  duration: string;
  course: string;
  imageUrl: string;
  videoUrl: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: CouponType;
}

export interface Order {
  id: EntityId;
  studentName: string;
  courseTitle: string;
  price: number;
  date: string;
  status: OrderStatus;
  paymentMethod: string;
}

export interface ExamTopic {
  id: EntityId;
  courseId: EntityId;
  category: string;
  title: string;
  description: string;
  badge: string;
  badgeBg: string;
  isFree: boolean;
}

export interface ExamCategory {
  id: EntityId;
  name: string;
  badgeBg: string;
}

export interface ExamQuestion {
  id: EntityId;
  category: string;
  categoryName: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface StudentSummary {
  id: number;
  name: string;
  email: string;
  school: string;
  level: string;
  enrolledCount: number;
}

export interface StudentProfile {
  nickname: string;
  fullName: string;
  school: string;
  level: string;
  email: string;
  password: string;
}

export interface CourseCategory {
  emoji: string;
  name: string;
}

export interface Review {
  name: string;
  text: string;
  score: string;
  avatar: string;
  imagePosition: string;
  school: string;
  course: string;
}

export interface Article {
  id: number;
  title: string;
  date: string;
  views: number;
  readTime: string;
}

export interface PromoSlide {
  id: EntityId;
  bg1: string;
  bg2: string;
  label: string;
  title: string;
  desc: string;
  badgeText: string;
  imageUrl: string;
  actionText: string;
  actionType: SlideActionType;
  targetCourseId: EntityId | '';
}

export interface LiveComment {
  id: number;
  avatar: string;
  bg: string;
  username: string;
  badge: boolean;
  time: string;
  text: string;
}

export interface Enrollment {
  courseId: EntityId;
  progress: number;
}

export interface MockAppState {
  language: LanguageCode;
  enrolledCourseIds: EntityId[];
  guestCommentUsername: string;
}

export interface NewCourseDefaults {
  originalPriceMultiplier: number;
  badgeBg: string;
  tagBg: string;
  tagColor: string;
  instructor: string;
  hours: number;
  validity: number;
  imageUrl: string;
}

export interface AdminMockDefaults {
  currentStudentId: number;
  maskedPassword: string;
  newCourse: NewCourseDefaults;
}

export interface AuthSession {
  role: UserRole;
}

export interface CartRepository {
  getItems(): Course[];
  saveItems(items: Course[]): void;
}

export interface EnrollmentRepository {
  getAll(): Enrollment[];
  saveAll(enrollments: Enrollment[]): void;
}

export interface StudentProfileRepository {
  get(): StudentProfile;
  save(profile: StudentProfile): void;
}

export interface AuthSessionRepository {
  get(): AuthSession;
  save(session: AuthSession): void;
  clear(): void;
}

export interface NotesRepository {
  getAll(): StudentNote[];
  saveAll(notes: StudentNote[]): void;
}

export interface StudentNote {
  lessonTitle: string;
  text: string;
}
