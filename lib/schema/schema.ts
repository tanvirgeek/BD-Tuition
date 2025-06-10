import { z } from "zod";

export const userRegistrationSchema = z.object({
  firebaseId: z.string().nonempty("Firebase ID is required"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["TEACHER", "STUDENT"]).refine(value => ["TEACHER", "STUDENT"].includes(value), {
    message: "Invalid role",
  }),
  email: z.string().email("Invalid email address"),
  isGoogleLogin: z.boolean()
});
