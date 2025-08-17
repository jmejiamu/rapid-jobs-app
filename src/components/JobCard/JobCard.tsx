import React from "react";
import { Text, View, Modal, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import { PostJobType } from "@/src/types/postjob";
import { styles } from "./styles/styles";

export const JobCard = ({ job }: { job: PostJobType }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const handleImagePress = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setModalVisible(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.pay}>${job.pay}</Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {job.description}
      </Text>
      {/* Display images if available */}
      {Array.isArray(job.images) && job.images.length > 0 && (
        <View style={styles.rowContainer}>
          {job.images.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleImagePress(img.lg || img.sm || img.original)}
            >
              <Image
                source={{ uri: img.sm || img.lg || img.original }}
                style={styles.image}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Text style={styles.date}>
        Posted at :{" "}
        {job?.postedAt ? new Date(job.postedAt).toLocaleDateString() : ""}
      </Text>
      {/* Modal for full-size image */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={{ position: "absolute", top: 40, right: 20 }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImg}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};
