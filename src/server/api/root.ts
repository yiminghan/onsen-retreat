// import { emailRouter } from "~/server/api/routers/email";
import { artSubmissionRouter } from "~/server/api/routers/art-submission";
import { hackathonSubmissionRouter } from "~/server/api/routers/hackathon-submission";
import { videoSubmissionRouter } from "~/server/api/routers/video-submission";
import { waitlistRouter } from "~/server/api/routers/waitlist";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  waitlist: waitlistRouter,
  videoSubmission: videoSubmissionRouter,
  hackathonSubmission: hackathonSubmissionRouter,
  artSubmission: artSubmissionRouter,
  // email: emailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
