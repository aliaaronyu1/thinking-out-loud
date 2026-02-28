import { db } from "./db";
import {
  posts,
  type CreatePostRequest,
  type UpdatePostRequest,
  type PostResponse
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getPosts(): Promise<PostResponse[]>;
  getPost(id: number): Promise<PostResponse | undefined>;
  createPost(post: CreatePostRequest): Promise<PostResponse>;
  updatePost(id: number, updates: UpdatePostRequest): Promise<PostResponse | undefined>;
  deletePost(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getPosts(): Promise<PostResponse[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPost(id: number): Promise<PostResponse | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: CreatePostRequest): Promise<PostResponse> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, updates: UpdatePostRequest): Promise<PostResponse | undefined> {
    const [updatedPost] = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const [deletedPost] = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    return !!deletedPost;
  }
}

export const storage = new DatabaseStorage();
