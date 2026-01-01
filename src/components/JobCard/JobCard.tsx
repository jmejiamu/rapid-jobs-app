import React from "react";
import { Text, View, Modal, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import { PostJobType } from "@/src/types/postjob";
import { styles } from "./styles/styles";
import { fontSize } from "@/src/theme/fontStyle";
import { AntDesign } from "@expo/vector-icons";

export const JobCard = ({
  job,
  leftElement,
  rightElement,
}: {
  job: PostJobType;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const handleImagePress = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setModalVisible(true);
  };

  const formatDateTime = () => {
    if (!job.postedAt) return "Today 2-4 pm";
    const date = new Date(job.postedAt);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "Today 2-4 pm";
    }

    return date.toLocaleDateString();
  };

  return (
    <View style={styles.card}>
      {job.userId && typeof job.userId !== "string" && (
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View style={styles.avatarContainer}>
              <Text>{job.userId.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.userName}>{job.userId.name}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.averageRatingText}>
              {Math.round(job.userId.averageRating * 10) / 10}
            </Text>
            <AntDesign name="star" size={16} color="#fedb15ff" />
          </View>
        </View>
      )}

      {/* Display images if available */}
      {Array.isArray(job.images) && job.images.length > 0 && (
        <View style={styles.rowContainer}>
          {job.images
            .filter((img) => img && (img.sm || img.lg || img.original)) // Filtrar imágenes inválidas
            .map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() =>
                  handleImagePress(img.lg || img.sm || img.original)
                }
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

      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.pay}>Pay ${job.pay}</Text>
      <Text style={styles.dateTime}>Date/time - {formatDateTime()}</Text>
      {job.address && (
        <Text style={styles.address}>address - {job.address}</Text>
      )}

      <View style={{ flexDirection: "row" }}>
        {rightElement && (
          <View style={styles.rightElement}>{rightElement}</View>
        )}
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
      </View>
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
