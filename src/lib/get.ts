import { useQuery } from "@tanstack/react-query";
import { VendingDataType } from "../../types/types";

export const getVendingInfo = async () => {
  try {
    const response = await fetch("./api/vending");
    if (!response.ok) {
      throw new Error("Unable to fetch /api/vending");
    }
    const getData = await response.json();

    if (!getData) return [];

    return getData.map((item: VendingDataType) => ({
      opening_hour: item.opening_hour,
      payment_type: item.payment_type,
      type: item.type,
      name: item.name,
      location: item.location,
    }));
  } catch (error) {
    console.error("Error fetching vending data:", error);
  }
};

export function useVendingInfo() {
  return useQuery({
    queryKey: ["vendingInfo"],
    queryFn: async () => {
      const data = await getVendingInfo();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export const getVendingLocation = async () => {
  try {
    const response = await fetch("./api/location");
    if (!response.ok) throw new Error("Unable to fetch /api/location");
    const getData = await response.json();

    if (getData) {
      const arr: google.maps.LatLngLiteral[] = [];
      for (let i = 0; i < getData.length; i++) {
        arr.push({
          lat: parseFloat(getData[i].lat),
          lng: parseFloat(getData[i].lng),
        });
      }
      return arr;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export function useVendingLocation() {
  return useQuery({
    queryKey: ["vendingLocation"],
    queryFn: async () => {
      const data = await getVendingLocation();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
