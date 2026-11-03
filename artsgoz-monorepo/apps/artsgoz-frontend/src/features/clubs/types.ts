export interface ClubActivity {
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
}

export interface ClubAchievement {
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  imageUrl: string;
}

export interface Club {
  id: string;
  nameKey: string;
  categoryKey: string;
  descriptionKey: string;
  imageUrl: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  email?: string;
  aboutTextKey?: string;
  activitiesTextKey?: string;
  galleryImages?: string[];
  activities?: ClubActivity[];
  achievements?: ClubAchievement[];
}
