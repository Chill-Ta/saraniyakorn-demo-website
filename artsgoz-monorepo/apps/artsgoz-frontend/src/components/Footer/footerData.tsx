import React from 'react';
import { PATHS } from '../../routes/paths.js';

export interface LinkItem {
  /** Translation key — call t(link.label) in the component. */
  label: string;
  path: string;
  isExternal?: boolean;
}

export interface FooterSectionData {
  /** Translation key for section header */
  title: string;
  links: LinkItem[];
}

export interface FooterColumnGroupData {
  sections: FooterSectionData[];
}

export interface FooterColumnData {
  title: string;
  links: LinkItem[];
}

export interface SocialLinkData {
  href: string;
  /** Translation key — call t(link.label) in the component. */
  label: string;
  isExternal?: boolean;
  icon: React.ReactNode;
}

export const SOCIAL_LINKS: SocialLinkData[] = [
  {
    href: 'mailto:artgoz@gmail.com',
    label: 'footer.social.email',
    isExternal: false,
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 7L13.009 12.727C12.7039 12.9042 12.3573 12.9976 12.0045 12.9976C11.6517 12.9976 11.3051 12.9042 11 12.727L2 7M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="#D23976" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: 'https://www.facebook.com/artsgozcu/?locale=th_TH',
    label: 'footer.social.facebook',
    isExternal: true,
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#DE5D8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/arts_goz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    label: 'footer.social.instagram',
    isExternal: true,
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 6.5H17.51M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM16 11.3698C16.1234 12.2021 15.9812 13.052 15.5937 13.7988C15.2062 14.5456 14.5931 15.1512 13.8416 15.5295C13.0901 15.9077 12.2384 16.0394 11.4077 15.9057C10.5771 15.7721 9.80971 15.3799 9.21479 14.785C8.61987 14.1901 8.22768 13.4227 8.09402 12.592C7.96035 11.7614 8.09202 10.9097 8.47028 10.1582C8.84854 9.40667 9.45414 8.79355 10.2009 8.40605C10.9477 8.01856 11.7977 7.8764 12.63 7.99981C13.4789 8.1257 14.2648 8.52128 14.8716 9.12812C15.4785 9.73496 15.8741 10.5209 16 11.3698Z" stroke="#DE5D8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@artsgoz?is_from_webapp=1&sender_device=pc',
    label: 'footer.social.tiktok',
    isExternal: true,
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.9989 9.40015C18.9989 9.64332 18.8014 9.84337 18.5599 9.83121C17.2699 9.76608 16.01 9.4151 14.8701 8.8033C14.5617 8.63751 14.1699 8.85304 14.1699 9.20562V15.3687C14.1699 16.6615 13.7946 17.926 13.0903 19.0068C12.386 20.0877 11.3834 20.9376 10.2058 21.4521C9.02816 21.9666 7.72689 22.1233 6.46203 21.9029C5.19717 21.6824 4.02387 21.0944 3.08644 20.2113C2.14901 19.3281 1.48833 18.1883 1.18566 16.9319C0.882993 15.6756 0.951536 14.3576 1.38286 13.14C1.81418 11.9224 2.58948 10.8583 3.61338 10.0786C4.63729 9.29885 5.86516 8.83754 7.14597 8.75135C7.20321 8.7483 7.26045 8.75717 7.31414 8.7774C7.36782 8.79762 7.41679 8.82878 7.45799 8.86892C7.49918 8.90906 7.53172 8.95732 7.55356 9.01068C7.57541 9.06405 7.5861 9.12138 7.58497 9.1791V12.2739C7.58497 12.5171 7.38742 12.7127 7.14816 12.7525C6.65285 12.8364 6.19167 13.0611 5.81901 13.4003C5.44635 13.7394 5.17774 14.1788 5.04485 14.6666C4.91195 15.1544 4.92032 15.6703 5.06897 16.1535C5.21761 16.6366 5.50033 17.0669 5.88379 17.3936C6.26725 17.7203 6.73547 17.9298 7.23324 17.9974C7.73101 18.0649 8.23758 17.9877 8.69323 17.7749C9.14887 17.562 9.5346 17.2224 9.80492 16.7961C10.0752 16.3698 10.2189 15.8745 10.219 15.3687V1.44211C10.219 1.32486 10.2652 1.2124 10.3475 1.12949C10.4299 1.04658 10.5415 1 10.6579 1H13.7309C13.8483 1.00301 13.9603 1.04998 14.0452 1.13174C14.13 1.21349 14.1815 1.32415 14.1897 1.44211C14.2923 2.57472 14.7859 3.63528 15.5845 4.43939C16.3831 5.24349 17.4363 5.74027 18.561 5.84335C18.8025 5.86546 19 6.30536L18.9989 9.40015Z" stroke="#DE5D8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

/** Matches Figma node #7692:35405 column structure */
export const FOOTER_COLUMN_GROUPS: FooterColumnGroupData[] = [
  {
    // Group 1:เกี่ยวกับ ก.อศ. & ฝ่ายประชาสัมพันธ์
    sections: [
      {
        title: 'footer.columns.about_title',
        links: [
          { label: 'footer.columns.about_link', path: PATHS.ABOUT },
          { label: 'footer.columns.committee_link', path: PATHS.ABOUT },
          { label: 'footer.columns.mental_health_link', path: 'https://chula.wellness.in.th/', isExternal: true },
        ],
      },
      {
        title: 'footer.columns.pr_title',
        links: [
          { label: 'footer.columns.pr_schedule_link', path: PATHS.ROOT },
          { label: 'footer.columns.pr_contact_link', path: 'https://www.facebook.com/artsgozcu/?locale=th_TH', isExternal: true },
        ],
      },
    ],
  },
  {
    // Group 2: ช่วยเหลือ/ร้องเรียน & กิจกรรม
    sections: [
      {
        title: 'footer.columns.help_title',
        links: [
          { label: 'footer.columns.help_faq_link', path: PATHS.HELP },
          { label: 'footer.columns.complaint_link', path: PATHS.HELP },
        ],
      },
      {
        title: 'footer.columns.activities_title',
        links: [
          { label: 'footer.columns.news_link', path: PATHS.ARTICLES },
          { label: 'footer.columns.articles_link', path: PATHS.ARTICLES },
          { label: 'footer.columns.clubs_link', path: PATHS.CLUBS },
        ],
      },
    ],
  },
  {
    // Group 3: เกี่ยวกับเว็บไซต์ & อื่น ๆ
    sections: [
      {
        title: 'footer.columns.website_title',
        links: [
          { label: 'footer.columns.privacy_link', path: PATHS.HELP },
          { label: 'footer.columns.report_link', path: PATHS.HELP },
        ],
      },
      {
        title: 'footer.columns.other_title',
        links: [
          { label: 'footer.columns.main_website_link', path: 'https://www.arts.chula.ac.th/th/', isExternal: true },
        ],
      },
    ],
  },
];

// Legacy export for backward compatibility
export const FOOTER_COLUMNS: FooterColumnData[] = FOOTER_COLUMN_GROUPS.flatMap((g) =>
  g.sections.map((s) => ({ title: s.title, links: s.links }))
);
