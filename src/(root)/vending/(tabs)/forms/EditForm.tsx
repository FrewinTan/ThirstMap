import { useState } from "react";

const EditForm = ({
  backButtonPressed,
}: {
  backButtonPressed: (item: boolean) => void;
}) => {
  const [labelPressed, setLabelPressed] = useState<string | null>();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("Form submitting...");

    if (labelPressed == null || message.trim() == "") {
      setSubmissionStatus("Please fill in all the fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = {
        suggestAnEdit: labelPressed,
        message,
      };

      const response = await fetch("./api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus("Form submitted successfully");
        setMessage("");
        setLabelPressed(null);
      } else {
        setSubmissionStatus(
          "There was an issue with your submission. Please try again."
        );
      }
    } catch (error) {
      setSubmissionStatus("Error submitting form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} method="POST">
        <fieldset className="mt-3">
          <label>Suggest an edit</label>
          <div className="flex flex-row">
            <input
              type="radio"
              id="location"
              name="location"
              checked={labelPressed == "location"}
              onChange={() => setLabelPressed("location")}
            />
            <label htmlFor="location">Location</label>
          </div>
          <div className="flex flex-row">
            <input
              type="radio"
              id="opening_hour"
              name="opening_hour"
              checked={labelPressed == "opening_hour"}
              onChange={() => setLabelPressed("opening_hour")}
            />
            <label htmlFor="opening_hour">Opening Hour</label>
          </div>
          <div className="flex flex-row">
            <input
              type="radio"
              id="payment_type"
              name="payment_type"
              checked={labelPressed == "payment_type"}
              onChange={() => setLabelPressed("payment_type")}
            />
            <label htmlFor="payment_type">Payment Type</label>
          </div>
        </fieldset>

        <fieldset className="mt-3">
          <label>Edit Information</label>
          <div>
            <textarea
              id="message"
              name="message"
              className="border-1 rounded-[10px]"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
            />
          </div>
        </fieldset>

        <div className="justify-end flex space-x-2">
          <button
            type="button"
            className="rounded-[20px] mt-3 border-1 border-black/50"
            onClick={() => backButtonPressed(true)}
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

        <div className="justify-center flex text-red-500 pt-4">
          {submissionStatus && <p>{submissionStatus}</p>}
        </div>
      </form>
    </div>
  );
};

export default EditForm;
