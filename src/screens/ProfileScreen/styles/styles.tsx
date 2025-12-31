import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Section
  headerSection: {
    backgroundColor: colors.surface,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  // Notification Icon
  notificationIcon: {
    position: "absolute",
    top: height * 0.07,
    right: 20,
    padding: 8,
    zIndex: 10,
  },

  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  notificationBadgeText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: "700",
  },

  // Profile Header
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: height * 0.07,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.surface,
    letterSpacing: 1,
  },

  profileInfo: {
    flex: 1,
    // marginLeft: 16,
    justifyContent: "center",
  },

  userName: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 8,
    textAlign: "center",
  },

  userDetails: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  verifiedIcon: {
    marginLeft: 6,
    marginRight: 4,
  },

  verified: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: "600",
  },

  // Stats Container
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: 120,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: fontSize.xxs,
    color: colors.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
  },

  // Action Buttons
  actionButtonsContainer: {
    marginTop: 4,
  },

  postJobButton: {
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  // Menu Section
  menuSection: {
    backgroundColor: colors.surface,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textPrimary,
    marginLeft: 12,
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  menuItemText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },

  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    paddingHorizontal: 6,
  },

  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "700",
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
    marginHorizontal: 12,
  },

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
    backgroundColor: `${colors.error}08`,
  },

  logoutIconContainer: {
    backgroundColor: `${colors.error}15`,
  },

  logoutText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.error,
    flex: 1,
  },

  // Jobs Section
  jobsSection: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  // Loading States
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  emptyStateContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  // Load More Button
  loadMoreButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  loadMoreText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },

  // Not Logged In State
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  notLoggedInIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },

  notLoggedInTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },

  notLoggedInDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },

  notLoggedInButtons: {
    width: "100%",
    gap: 12,
  },

  loginButton: {
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  registerButton: {
    borderRadius: 12,
  },

  // Footer Spacing
  footerSpacing: {
    height: 32,
  },

  rowContainer: {
    flexDirection: "row",
    marginBottom: 32,
  },
  infoContainer: {
    justifyContent: "flex-end",
    marginLeft: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginVertical: 16,
  },
});
