import { z } from "zod";

import { schema } from "../screens/PostJobScreen/schema/formSchema";
import { ImageObject } from "./imgUploader";

export interface PostJobType extends z.infer<typeof schema> {
  _id?: string; //This is the post id
  postedAt?: Date; // This is the date when the job was posted
  images?: ImageObject[]; // Array of images associated with the job post
}

export interface RequestedJob extends PostJobType {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    pay: string;
    address: string;
    description: string;
    images: ImageObject[];
    userId: string;
    postedAt: Date;
    __v: number;
  };
  userId: {
    _id: string;
    name: string;
  };
  ownerPostId: string;
  status: string;
  requestedAt: Date;
}
