import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";

export function useAutoCompleteSuggestion({
  input,
}: {
  input: string;

}) {
  const placesLibrary = useMapsLibrary("places");
	
  const [suggestion, setSuggestion] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!placesLibrary) return;

    const autoCompleteSuggestion = async () => {
      setIsLoading(true);
      if (input == "") {
        setSuggestion([]);
      }

      try {
        const response =
          await placesLibrary?.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            {
              input: input,
              region: "SG",
            }
          );

        if (response.suggestions) {
          setSuggestion(response.suggestions);
        } else {
          setSuggestion([]);
        }
      } catch (error) {
        setError("Failed to fetch suggestions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(() => {
      autoCompleteSuggestion();
    }, 200);
  }, [input]);

  return { suggestion, isLoading, error };
}
