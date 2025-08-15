import { Text, View } from "react-native";

import { PostJobType } from "@/src/types/postjob";
import { styles } from "./styles/styles";

export const JobCard = ({ job }: { job: PostJobType }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.pay}>${job.pay}</Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {job.description}
      </Text>
      <Text style={styles.date}>
        Posted at :{" "}
        {job?.postedAt ? new Date(job.postedAt).toLocaleDateString() : ""}
      </Text>
    </View>
  );
};
