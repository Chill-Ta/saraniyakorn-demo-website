import { Club } from './types.js';

export const MOCK_CLUBS: Club[] = [
  // หมวดดนตรี ศิลปะ และการแสดง
  {
    id: 'club-01',
    nameKey: 'clubs.mock.club01.name',
    categoryKey: 'clubs.categories.music_art_drama',
    descriptionKey: 'clubs.mock.club01.desc',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-02',
    nameKey: 'clubs.mock.club02.name',
    categoryKey: 'clubs.categories.music_art_drama',
    descriptionKey: 'clubs.mock.club02.desc',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-03',
    nameKey: 'clubs.mock.club03.name',
    categoryKey: 'clubs.categories.music_art_drama',
    descriptionKey: 'clubs.mock.club03.desc',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-04',
    nameKey: 'clubs.mock.club04.name',
    categoryKey: 'clubs.categories.music_art_drama',
    descriptionKey: 'clubs.mock.club04.desc',
    instagram: 'leelartaksorncu',
    imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=400&h=600&fit=crop',
    aboutTextKey: 'clubs.mock.club04.about',
    activitiesTextKey: 'clubs.mock.club04.activities_text',
    facebook: 'https://www.facebook.com/artsgozcu/?locale=th_TH',
    tiktok: 'https://www.tiktok.com/@artsgoz',
    email: 'artgoz@gmail.com',
    galleryImages: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&fit=crop',
      'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&fit=crop',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&fit=crop'
    ],
    activities: [
      {
        titleKey: 'clubs.mock.club04.act01.title',
        descriptionKey: 'clubs.mock.club04.act01.desc',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&fit=crop'
      },
      {
        titleKey: 'clubs.mock.club04.act02.title',
        descriptionKey: 'clubs.mock.club04.act02.desc',
        imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=600&fit=crop'
      }
    ],
    achievements: [
      {
        titleKey: 'clubs.mock.club04.ach01.title',
        subtitleKey: 'clubs.mock.club04.ach01.sub',
        descriptionKey: 'clubs.mock.club04.ach01.desc',
        imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?q=80&w=1100&h=400&fit=crop'
      },
      {
        titleKey: 'clubs.mock.club04.ach02.title',
        subtitleKey: 'clubs.mock.club04.ach02.sub',
        descriptionKey: 'clubs.mock.club04.ach02.desc',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1100&h=400&fit=crop'
      },
      {
        titleKey: 'clubs.mock.club04.ach03.title',
        subtitleKey: 'clubs.mock.club04.ach03.sub',
        descriptionKey: 'clubs.mock.club04.ach03.desc',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1100&h=400&fit=crop'
      },
      {
        titleKey: 'clubs.mock.club04.ach04.title',
        subtitleKey: 'clubs.mock.club04.ach04.sub',
        descriptionKey: 'clubs.mock.club04.ach04.desc',
        imageUrl: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?q=80&w=1100&h=400&fit=crop'
      }
    ]
  },
  {
    id: 'club-05',
    nameKey: 'clubs.mock.club05.name',
    categoryKey: 'clubs.categories.music_art_drama',
    descriptionKey: 'clubs.mock.club05.desc',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&h=600&fit=crop',
  },

  // หมวดกีฬาและการออกกำลังกาย
  {
    id: 'club-06',
    nameKey: 'clubs.mock.club06.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club06.desc',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-07',
    nameKey: 'clubs.mock.club07.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club07.desc',
    instagram: 'artscu.girlfutsal',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-08',
    nameKey: 'clubs.mock.club08.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club08.desc',
    instagram: 'artscuvolleyball',
    imageUrl: 'https://images.unsplash.com/photo-1592656094267-764a4506857f?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-09',
    nameKey: 'clubs.mock.club09.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club09.desc',
    instagram: 'artsbadminton',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-10',
    nameKey: 'clubs.mock.club10.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club10.desc',
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-11',
    nameKey: 'clubs.mock.club11.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club11.desc',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-12',
    nameKey: 'clubs.mock.club12.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club12.desc',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-13',
    nameKey: 'clubs.mock.club13.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club13.desc',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-14',
    nameKey: 'clubs.mock.club14.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club14.desc',
    imageUrl: 'https://images.unsplash.com/photo-1578762560072-0c694193e91b?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-15',
    nameKey: 'clubs.mock.club15.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club15.desc',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-16',
    nameKey: 'clubs.mock.club16.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club16.desc',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-17',
    nameKey: 'clubs.mock.club17.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club17.desc',
    imageUrl: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-18',
    nameKey: 'clubs.mock.club18.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club18.desc',
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-19',
    nameKey: 'clubs.mock.club19.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club19.desc',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-20',
    nameKey: 'clubs.mock.club20.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club20.desc',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-21',
    nameKey: 'clubs.mock.club21.name',
    categoryKey: 'clubs.categories.sports_exercise',
    descriptionKey: 'clubs.mock.club21.desc',
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=400&h=600&fit=crop',
  },

  // หมวดเกมและนันทนาการ
  {
    id: 'club-22',
    nameKey: 'clubs.mock.club22.name',
    categoryKey: 'clubs.categories.games_recreation',
    descriptionKey: 'clubs.mock.club22.desc',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-23',
    nameKey: 'clubs.mock.club23.name',
    categoryKey: 'clubs.categories.games_recreation',
    descriptionKey: 'clubs.mock.club23.desc',
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=400&h=600&fit=crop',
  },

  // หมวดวิชาการและภาษา
  {
    id: 'club-24',
    nameKey: 'clubs.mock.club24.name',
    categoryKey: 'clubs.categories.academic_languages',
    descriptionKey: 'clubs.mock.club24.desc',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-25',
    nameKey: 'clubs.mock.club25.name',
    categoryKey: 'clubs.categories.academic_languages',
    descriptionKey: 'clubs.mock.club25.desc',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&h=600&fit=crop',
  },
  {
    id: 'club-26',
    nameKey: 'clubs.mock.club26.name',
    categoryKey: 'clubs.categories.academic_languages',
    descriptionKey: 'clubs.mock.club26.desc',
    imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=400&h=600&fit=crop',
  },
];
