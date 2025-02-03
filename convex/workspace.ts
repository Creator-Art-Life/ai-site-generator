import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
  args: {
    messages: v.any(),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    const workspaceId = await ctx.db.insert("workspace", {
      messages: args.messages, // JSON
      user: args.user,
    });

    return workspaceId;
  },
});

export const GetWorkspace = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workspaceId);
    return result;
  },
});

export const UpdateMessages = mutation({
  args: {
    workspaceId: v.id("workspace"),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, {
      messages: args.messages,
    });

    return result;
  },
});

export const UpdateFiles = mutation({
  args: {
    workspaceId: v.id("workspace"),
    files: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, {
      fileData: args.files,
    });

    return result;
  },
});

export const GetAllWorkspace = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("workspace")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .collect();

    return result;
  },
});

export const DeleteWorkspace = mutation({
  args: {
    id: v.id("workspace"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Получаем workspace по id
    const workspace = await ctx.db.get(args.id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Проверяем, что переданный userId соответствует владельцу workspace
    if (workspace.user !== args.userId) {
      // Здесь workspace.userId должно быть полем, указывающим на владельца
      throw new Error("You do not have permission to delete this workspace");
    }

    // Если проверка прошла, удаляем workspace
    await ctx.db.delete(args.id);

    return { success: true };
  },
});
