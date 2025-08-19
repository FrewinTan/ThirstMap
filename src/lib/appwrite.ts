import { useQuery } from "@tanstack/react-query";

export async function getFileImage(name: string) {
  try {
    const response = await fetch(`./api/image?name=${name}`);
    return response.json()
  } catch (error) {
    console.error("No Image Found");
  }
}

export function useFileImage(name: string) {
  return useQuery({
    queryKey: ["fileDetails", name],
    queryFn: async () => {
      const data = await getFileImage(name);
      return data;
    },
    enabled: !!name,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export async function postCrowdSourceImage(name: string) {
  const response = await fetch("/api/crowdsource");
  return response.json();
}
