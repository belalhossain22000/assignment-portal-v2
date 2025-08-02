import { baseApi } from "@/redux/api/baseApi";

export const submissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submissionChartInstructor: builder.query({
      query: () => ({
        url: "/submissions/instructor-chart-data",
        method: "GET",
      }),
      providesTags: ["AssignmentSubmission"],
    }),
  }),
});

export const { useSubmissionChartInstructorQuery } = submissionApi;
