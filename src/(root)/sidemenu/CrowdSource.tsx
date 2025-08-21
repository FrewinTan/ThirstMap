import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { icons } from "../../constants";

const CrowdSource = () => {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");
  const [fileName, setFileName] = useState("No file selected");

  const [file, setFile] = useState<File | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prevprogress) => {
        if (prevprogress < 100) {
          return prevprogress + 5;
        } else {
          clearInterval(progressInterval);
          return 100;
        }
      });
    }, 200);
  }, [fileName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("Form submitting...");

    if (
      location.trim() == "" ||
      type.trim() == "" ||
      fileName == "No file selected"
    ) {
      setSubmissionStatus("Please fill in all the fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataText = {
        type,
        location,
      };

      const responseText = await fetch("/api/crowdsource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataText),
      });

      const formData = new FormData();
      if (file) {
        formData.append("file", file, file.name);
      }

      const response = await fetch("/api/post", {
        method: "POST",
        body: formData,
      });

      setSubmissionStatus(
        responseText.ok && response.ok
          ? "Form submitted successfully"
          : "There was an issue with your submission. Please try again."
      );

      if (responseText.ok && response.ok) {
        setType("");
        setLocation("");
        setFile(null);
        setFileName("No file selected");
      }
    } catch (error) {
      setSubmissionStatus("Error submitting form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-dvh w-dvw justify-center items-center flex">
      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
			<h1 className="font-[Inter] mb-3">Help us update the website with the latest information.</h1>
        <div className="border border-black border-solid rounded-[10px] p-5">
          <div>
            <label
              className="font-bold text-[12px] font-[Inter] p-1"
              htmlFor="type_input"
            >
              Type of Vending Machine:
            </label>
            <select
              id="type_input"
              className="border border-[#CBCBCB] rounded-[10px] ml-3"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Drinks">Drinks</option>
              <option value="Food">Food</option>
              <option value="Orange Juice">Orange Juice</option>
              <option value="Chef In Box">Chef In Box</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label
              className="font-bold text-[12px] font-[Inter] p-1"
              htmlFor="location_input"
            >
              Location:
            </label>
            <input
              type="text"
              className="border border-soild border-[#CBCBCB] rounded-[10px] ml-3 mt-3"
              id="location_input"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <div className="flex flex-row items-center">
              <img
                src={icons.cloud_upload}
                className="border border-[#CBCBCB] rounded-full p-2"
              ></img>
              <div className="p-2">
                <h1 className="font-[Inter] text-[16px]">Upload files</h1>
                <p className="font-[Inter] text-[12px] text-gray-400">
                  Select and upload the file of your choice
                </p>
              </div>
            </div>

            <hr className="border-[#CBCBCB] h-[2px]"></hr>

            <div className="border-dotted border-[#CBCBCB] border w-full h-fit flex flex-col items-center rounded-[10px] mt-3 p-2">
              <img src={icons.cloud_upload} className="w-[24px] h-[24px]"></img>
              <h1 className="font-[Inter] text-[16px]">Choose a file</h1>
              <p className="font-[Inter] text-[12px] text-gray-400">
                JPEG, PNG, up to 50MB
              </p>
              <input
                type="file"
                id="photo_selector"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(event) => {
                  if (event.target?.files) {
                    setFileName(event.target.files[0].name);
                    setFile(event.target.files[0]);
                  }
                }}
              ></input>
              <label
                htmlFor="photo_selector"
                className="border-[#CBCBCB] rounded-[20px] border mt-3 p-1"
              >
                Browse File
              </label>
            </div>

            <div className="border-[#CBCBCB] border rounded-[10px] p-2 mt-3">
              <h1>{fileName}</h1>
              {file && (
                <div className="bg-[#CBCBCB] w-full h-2 rounded-full">
                  <div
                    className="bg-[#A8C4FF] h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div className="justify-end flex space-x-2">
            <Link to="/">
              <button
                type="button"
                className="rounded-[20px] mt-3 border border-black/50"
              >
                <h1 className="p-1 px-3 text-[#A8C4FF]">Back</h1>
              </button>
            </Link>

            <button
              type="submit"
              className="bg-[#A8C4FF] rounded-[20px] mt-3 min-w-16"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex justify-center">
                  <div className="animate-spin w-4 h-4 border-gray-400 border-t-2 rounded-full"></div>
                </div>
              ) : (
                <h1 className="p-1 px-3">Submit</h1>
              )}
            </button>
          </div>

          <div className="justify-center flex text-red-500 pt-4">
            {submissionStatus && <p>{submissionStatus}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CrowdSource;
