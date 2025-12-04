// In-memory mock data stores
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "vendor" | "admin";
  status: "active" | "suspended";
  createdAt: Date;
}

export interface Job {
  id: string;
  vendorId: string;
  customerName: string;
  vehicleNo: string;
  status: "pending" | "paid" | "completed";
  approvalCode: string | null;
  amount: number;
  createdAt: Date;
  paidAt: Date | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  completedAt: Date | null;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "resolved";
  createdAt: Date;
}

// In-memory stores
const users: User[] = [
  {
    id: "admin-1",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "vendor-1",
    email: "vendor@example.com",
    password: "vendor123",
    name: "Demo Vendor",
    role: "vendor",
    status: "active",
    createdAt: new Date(),
  },
];

const jobs: Job[] = [];
const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome to ASLON Vendor Portal",
    content: "We're excited to have you on board! Please complete your profile and review the training materials.",
    authorId: "admin-1",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "ann-2",
    title: "New Speedlimiter Service Guidelines",
    content: "Please review the updated guidelines for speedlimiter installation procedures.",
    authorId: "admin-1",
    createdAt: new Date(Date.now() - 172800000),
  },
];

const courses: Course[] = [
  {
    id: "course-1",
    title: "Speedlimiter Installation Basics",
    description: "Learn the fundamentals of speedlimiter installation and safety procedures.",
    videoUrl: "https://example.com/video1",
    duration: 30,
  },
  {
    id: "course-2",
    title: "Customer Service Excellence",
    description: "Best practices for customer interaction and service delivery.",
    videoUrl: "https://example.com/video2",
    duration: 45,
  },
  {
    id: "course-3",
    title: "Payment Processing",
    description: "Understanding payment workflows and receipt generation.",
    videoUrl: "https://example.com/video3",
    duration: 20,
  },
];

const courseProgress: CourseProgress[] = [];
const forumPosts: ForumPost[] = [];
const supportTickets: SupportTicket[] = [];

// Store management functions
export const mockStore = {
  users: {
    getAll: () => users,
    findByEmail: (email: string) => users.find((u) => u.email === email),
    findById: (id: string) => users.find((u) => u.id === id),
    create: (user: Omit<User, "id" | "createdAt">) => {
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
        createdAt: new Date(),
      };
      users.push(newUser);
      return newUser;
    },
    update: (id: string, updates: Partial<User>) => {
      const index = users.findIndex((u) => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return users[index];
      }
      return null;
    },
    getVendors: () => users.filter((u) => u.role === "vendor"),
  },
  jobs: {
    getAll: () => jobs,
    getByVendorId: (vendorId: string) => jobs.filter((j) => j.vendorId === vendorId),
    findById: (id: string) => jobs.find((j) => j.id === id),
    create: (job: Omit<Job, "id" | "createdAt" | "approvalCode" | "status" | "paidAt">) => {
      const newJob: Job = {
        ...job,
        id: `job-${Date.now()}`,
        status: "pending",
        approvalCode: null,
        createdAt: new Date(),
        paidAt: null,
      };
      jobs.push(newJob);
      return newJob;
    },
    update: (id: string, updates: Partial<Job>) => {
      const index = jobs.findIndex((j) => j.id === id);
      if (index !== -1) {
        jobs[index] = { ...jobs[index], ...updates };
        return jobs[index];
      }
      return null;
    },
  },
  announcements: {
    getAll: () => announcements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    findById: (id: string) => announcements.find((a) => a.id === id),
    create: (announcement: Omit<Announcement, "id" | "createdAt">) => {
      const newAnnouncement: Announcement = {
        ...announcement,
        id: `ann-${Date.now()}`,
        createdAt: new Date(),
      };
      announcements.push(newAnnouncement);
      return newAnnouncement;
    },
  },
  courses: {
    getAll: () => courses,
    findById: (id: string) => courses.find((c) => c.id === id),
  },
  courseProgress: {
    getByUser: (userId: string) => courseProgress.filter((cp) => cp.userId === userId),
    getByUserAndCourse: (userId: string, courseId: string) =>
      courseProgress.find((cp) => cp.userId === userId && cp.courseId === courseId),
    update: (userId: string, courseId: string, progress: number, completed: boolean) => {
      const existing = courseProgress.find((cp) => cp.userId === userId && cp.courseId === courseId);
      if (existing) {
        existing.progress = progress;
        existing.completed = completed;
        if (completed && !existing.completedAt) {
          existing.completedAt = new Date();
        }
        return existing;
      } else {
        const newProgress: CourseProgress = {
          userId,
          courseId,
          progress,
          completed,
          completedAt: completed ? new Date() : null,
        };
        courseProgress.push(newProgress);
        return newProgress;
      }
    },
  },
  forumPosts: {
    getAll: () => forumPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    findById: (id: string) => forumPosts.find((p) => p.id === id),
    create: (post: Omit<ForumPost, "id" | "createdAt" | "replies">) => {
      const newPost: ForumPost = {
        ...post,
        id: `post-${Date.now()}`,
        createdAt: new Date(),
        replies: [],
      };
      forumPosts.push(newPost);
      return newPost;
    },
    delete: (id: string) => {
      const index = forumPosts.findIndex((p) => p.id === id);
      if (index !== -1) {
        forumPosts.splice(index, 1);
        return true;
      }
      return false;
    },
    addReply: (postId: string, reply: Omit<ForumReply, "id" | "createdAt">) => {
      const post = forumPosts.find((p) => p.id === postId);
      if (post) {
        const newReply: ForumReply = {
          ...reply,
          id: `reply-${Date.now()}`,
          createdAt: new Date(),
        };
        post.replies.push(newReply);
        return newReply;
      }
      return null;
    },
  },
  supportTickets: {
    getAll: () => supportTickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    create: (ticket: Omit<SupportTicket, "id" | "createdAt" | "status">) => {
      const newTicket: SupportTicket = {
        ...ticket,
        id: `ticket-${Date.now()}`,
        status: "open",
        createdAt: new Date(),
      };
      supportTickets.push(newTicket);
      return newTicket;
    },
  },
};

// Generate unique approval code
export function generateApprovalCode(): string {
  const random1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const random2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ASLN-${random1}-${random2}`;
}

