import { useEffect, useState } from "react";
import { icons } from "../../../../constants";

const AddImages = ({
  backButtonPressed,
  name,
}: {
  backButtonPressed: (item: boolean) => void;
  name: string;
}) => {
  const [fileName, setFileName] = useState("No file selected");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");
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

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file, file.name);
      }

      const response = await fetch("./api/post", {
        method: "POST",
        body: formData,
      });

      setSubmissionStatus(
        response.ok
          ? "Form submitted successfully"
          : "There was an issue with your submission. Please try again."
      );

      if (response.ok) {
        setFile(null);
        setFileName("No file selected");
        setUploadProgress(0);
      }
    } catch (error) {
      setSubmissionStatus("Error submitting form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <div className="border border-[#CBCBCB] rounded-[10px] p-3">
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

          <div className="justify-end flex space-x-2">
            <button
              type="button"
              className="rounded-[20px] mt-3 border border-black/50"
              onClick={() => {
                backButtonPressed(true);
              }}
            >
              <h1 className="p-1 px-3 text-[#A8C4FF]">Back</h1>
            </button>

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

          <div className="justify-center flex text-red-500 p-2">
            {submissionStatus && <p>{submissionStatus}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddImages;
