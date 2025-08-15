import { z } from "zod";
export const schema = z.object({
  title: z.string().min(1, "Title is required"),
  pay: z.string().min(1, "Pay is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
});
