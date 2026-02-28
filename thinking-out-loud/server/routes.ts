import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  try {
    const existingPosts = await storage.getPosts();
    if (existingPosts.length === 0) {
      await storage.createPost({
        title: "Welcome to my new brain dump",
        content: "This is my personal space to think out loud. No pressure, no audience, just me clarifying my thoughts.\n\nI can write down:\n* Ideas I'm exploring\n* Articles I've read and my reactions\n* Concepts I don't fully understand yet\n\nLet's see how this goes!",
        status: "published"
      });
      await storage.createPost({
        title: "Learning about local-first software",
        content: "I've been reading up on local-first software. The idea is that your data lives on your device first, and syncs to the cloud in the background. It makes apps incredibly fast and offline-capable.\n\n*Why isn't everything built this way?*\nProbably because conflict resolution is hard. CRDTs seem to be the solution here.",
        status: "published"
      });
      await storage.createPost({
        title: "Draft: Book notes on 'Thinking, Fast and Slow'",
        content: "System 1 vs System 2.\nSystem 1: fast, automatic, frequent, emotional, stereotypic, subconscious.\nSystem 2: slow, effortful, infrequent, logical, calculating, conscious.\n\nNeed to write more about how this applies to software design...",
        status: "draft"
      });
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed the DB on startup
  seedDatabase().catch(console.error);

  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const post = await storage.getPost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  app.post(api.posts.create.path, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost(input);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.posts.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const input = api.posts.update.input.parse(req.body);
      const post = await storage.updatePost(id, input);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.posts.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const success = await storage.deletePost(id);
    if (!success) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(204).end();
  });

  app.get(api.news.list.path, async (req, res) => {
    try {
      // Using NewsAPI as an example. 
      // Note: In a real app, the API key should be an environment secret.
      // For this demo, we'll use a reliable public news source or mock it if needed.
      const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=d1604a11c1f54972826477e84997087e");
      const data = await response.json();
      
      if (data.status === "error") {
        throw new Error(data.message);
      }
      
      res.json(data.articles || []);
    } catch (error) {
      console.error("News fetch error:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  return httpServer;
}
