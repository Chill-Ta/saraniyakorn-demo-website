// Professor feature types
export interface Professor {
  id: string;
  nameKey: string;
  email: string;
  abbreviationKey: string;
  departmentKey: string;
  statusKey: string;
  locationKey: string;
  achievementsKeys: string[];
  qualificationsKeys: string[];
  coursesKeys: string[];
}

export interface ProfessorsFilter {
  department: string;
  status: string;
}
