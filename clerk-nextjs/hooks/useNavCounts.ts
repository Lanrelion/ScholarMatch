import { create } from "zustand";

interface NavCountsState {
  discoverCount: number;
  savedCount: number;
  deadlinesCount: number;
  alertsCount: number;
  isLoaded: boolean;
  fetchCounts: (force?: boolean) => Promise<void>;
}

export const useNavCounts = create<NavCountsState>((set, get) => ({
  discoverCount: 0,
  savedCount: 0,
  deadlinesCount: 0,
  alertsCount: 0,
  isLoaded: false,

  fetchCounts: async (force?: boolean) => {
    // Only fetch if we haven't successfully loaded yet
    if (get().isLoaded && !force) return;

    try {
      const [scholarshipsRes, savedRes, reviewsRes] = await Promise.all([
        fetch("/api/scholarships?limit=1"), // limit=1 just to get the total count quickly
        fetch("/api/saved"),
        fetch("/api/reviews")
      ]);

      let discoverCount = 0;
      if (scholarshipsRes.ok) {
        const data = await scholarshipsRes.json();
        discoverCount = data?.meta?.total || 0;
      }

      let savedData = [];
      if (savedRes.ok) {
        savedData = await savedRes.json();
      }

      let reviewsData = [];
      if (reviewsRes.ok) {
        reviewsData = await reviewsRes.json();
      }

      const now = new Date();
      const deadlinesCount = savedData.filter((item: any) => {
        if (!item.scholarship.deadline) return false;
        const deadline = new Date(item.scholarship.deadline);
        const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft >= 0 && daysLeft <= 30;
      }).length;

      const changeAlerts = savedData.filter((item: any) => item.changeAlerted).length;
      const pendingReviews = reviewsData.length;
      const alertsCount = changeAlerts + pendingReviews;
      const savedCount = savedData.length;

      set({
        discoverCount,
        savedCount,
        deadlinesCount,
        alertsCount,
        isLoaded: true
      });
    } catch (error) {
      console.error("Failed to fetch nav counts:", error);
    }
  }
}));
