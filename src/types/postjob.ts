import { z } from "zod";

import { schema } from "../screens/PostJobScreen/schema/formSchema";

export interface PostJobType extends z.infer<typeof schema> {
  _id?: string; //This is the post id
  postedAt?: Date; // This is the date when the job was posted
}
