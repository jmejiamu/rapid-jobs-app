import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { API_URL } from "@/config/api";
import { apiFetch } from "../utils/apiFetch";

interface UsePaginationOptions<T = any> {
  endpoint?: string;
  searchParam?: string;
  pageParam?: string;
  dataKey?: string; // Key in response that contains the array (default: 'jobs')
  paginationKey?: string; // Key in response that contains pagination (default: 'pagination')
}

interface UsePaginationReturn<T = any> {
  data: T[];
  loading: boolean;
  loadingMore: boolean;
  currentPage: number;
  totalPages: number;
  fetchData: (page?: number, searchQuery?: string) => Promise<void>;
  resetData: () => void;
  addNewItem: (newItem: T) => void;
  removeItem?: (itemId: string) => void;
}

export const usePagination = <T = any,>(
  options: UsePaginationOptions<T> = {}
): UsePaginationReturn<T> => {
  const {
    endpoint = "/jobs/retrieve-jobs",
    searchParam = "title",
    pageParam = "page",
    dataKey = "jobs",
    paginationKey = "pagination",
  } = options;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(
    async (page: number = 1, searchQuery: string = "") => {
      if (dataKey === "myJobs" && !accessToken) return;
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const url = new URL(`${API_URL}${endpoint}`);
        if (searchQuery) {
          url.searchParams.set(searchParam, searchQuery);
        }
        url.searchParams.set(pageParam, page.toString());

        const response = await apiFetch(url.toString(), {
          method: "GET",
        });

        const responseData = await response?.json();

        if (page === 1) {
          setData(responseData[dataKey]);
        } else {
          setData((prev) => [...prev, ...responseData[dataKey]]);
        }

        setTotalPages(responseData[paginationKey]?.totalPages);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [accessToken, endpoint, searchParam, pageParam, dataKey, paginationKey]
  );

  const resetData = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setTotalPages(1);
  }, []);

  const addNewItem = useCallback((newItem: T) => {
    setData((prevData) => [newItem, ...prevData]);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setData((prevData) => prevData.filter((item: any) => item._id !== itemId)); // Cast item to any to access _id
  }, []);

  return {
    data,
    loading,
    loadingMore,
    currentPage,
    totalPages,
    fetchData,
    resetData,
    addNewItem,
    removeItem,
  };
};
