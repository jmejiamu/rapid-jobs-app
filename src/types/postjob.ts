import { z } from "zod";

import { schema } from "../screens/PostJobScreen/schema/formSchema";
import { ImageObject } from "./imgUploader";

export interface PostJobType extends z.infer<typeof schema> {
  _id?: string; //This is the post id
  postedAt?: Date; // This is the date when the job was posted
  images?: ImageObject[]; // Array of images associated with the job post
}

export interface RequestedJob extends PostJobType {
  userId: {
    _id: string;
    name: string;
  };
  requests: [
    {
      userId: {
        _id: string;
        name: string;
      };
      status: string;
      requestedAt: Date;
    }
  ];
}
