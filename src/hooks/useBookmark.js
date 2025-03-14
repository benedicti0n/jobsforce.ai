import { useState } from "react";
import axios from "axios"; // Assuming axios is already installed
import Cookies from "js-cookie";
import { toast } from "sonner";

export const useBookmarkJob = () => {
  const [bookmarking, setBookmarking] = useState(false);

  const bookmarkJob = async (job) => {
    try {
      const token = Cookies.get("token");
      console.log(token);
      setBookmarking(true);
      const response = await axios.post(
        "https://api.jobsforce.ai/api/bookmarkjobs",
        {
          company: job.company || "Jobsforce",
          description: job.description || "We will cook perfect career for you.",
          job_url: job.job_url,
          title: job.title,
          typeofjob: job.job_type,
          company_logo: job.company_logo,
          location: job.location,
          salary: job.max_amount,
          mongoid: job.mongo_id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // Most JWT authentication expects "Bearer " prefix before the token
            authorization: `${token}`
          } // Include cookies for authentication
        }
      );

      // Success case
      toast.success("Job bookmarked successfully!");
      console.log('Bookmarked job:', response.data);
      return response.data;
      
    } catch (error) {
      // Check if error is due to job already being bookmarked
      if (error.response?.status === 400 && error.response?.data?.message === "Job already  bookmarked") {
        toast.info("You've already bookmarked this job!");
      } else {
        toast.error("Failed to bookmark job. Please try again.");
      }
      console.error("Error bookmarking job:", error);
      throw error;
    } finally {
      setBookmarking(false);
    }
  };

  return { bookmarkJob, bookmarking };
};
