export interface IGetAnalyticsResDto {
  totalComplaints: number | string;
  resolvedComplaints: number | string;
  pendingComplaints: number | string;
  complaintsMadeToday: number | string;
  // sitesWithAttendanceCount: {
  //   id: string;
  //   location: string;
  //   attendanceCount: number | string;
  // }[];
  complaintsByDays: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
    }[];
  };
  complaintsByCategory: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}