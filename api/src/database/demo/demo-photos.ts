export type DemoSport = 'HANDBALL' | 'FUTSAL';

export interface DemoPhoto {
  url: string;
  title: string;
  author: string;
  license: string;
  source: string;
}

export const TEAM_PHOTOS: Record<DemoSport, DemoPhoto[]> = {
  HANDBALL: [
    {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Mara_Friton_2006.jpg/960px-Mara_Friton_2006.jpg',
      title: 'Mara Friton 2006',
      author: 'Armin Kuebelbeck',
      license: 'CC BY-SA 3.0',
      source: 'https://commons.wikimedia.org/wiki/File:Mara_Friton_2006.jpg',
    },
    {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Faroese_handball_match_2010_VB_vs_Tjaldur.JPG/960px-Faroese_handball_match_2010_VB_vs_Tjaldur.JPG',
      title: 'Faroese handball match 2010 VB vs Tjaldur',
      author: 'Eileen Sandá',
      license: 'CC BY-SA 3.0',
      source:
        'https://commons.wikimedia.org/wiki/File:Faroese_handball_match_2010_VB_vs_Tjaldur.JPG',
    },
    {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Bdp_Handball.jpg/960px-Bdp_Handball.jpg',
      title: 'Bdp Handball',
      author: 'Rune Moyo',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Bdp_Handball.jpg',
    },
  ],
  FUTSAL: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Futebol_Salao_Pan2007.jpg',
      title: 'Futebol Salao Pan2007',
      author: 'Wilson Dias/ABr',
      license: 'CC BY 3.0 br',
      source: 'https://commons.wikimedia.org/wiki/File:Futebol_Salao_Pan2007.jpg',
    },
    {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Futsal_indoor.jpg/960px-Futsal_indoor.jpg',
      title: 'Futsal indoor',
      author: 'Christopherjeffrey04',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Futsal_indoor.jpg',
    },
    {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Kazakhstan_National_Futsal_Team_Training.jpg/960px-Kazakhstan_National_Futsal_Team_Training.jpg',
      title: 'Kazakhstan National Futsal Team Training',
      author: 'Ashina',
      license: 'CC BY-SA 4.0',
      source:
        'https://commons.wikimedia.org/wiki/File:Kazakhstan_National_Futsal_Team_Training.jpg',
    },
    {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/2025_FIFA_Futsal_Women%27s_World_Cup_Brazil_v_Panama.jpg/960px-2025_FIFA_Futsal_Women%27s_World_Cup_Brazil_v_Panama.jpg',
      title: '2025 FIFA Futsal Women’s World Cup Brazil v Panama',
      author: 'Patrick Cristiano',
      license: 'CC BY 4.0',
      source:
        'https://commons.wikimedia.org/wiki/File:2025_FIFA_Futsal_Women%27s_World_Cup_Brazil_v_Panama.jpg',
    },
    {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/SMSC_FUTSAL_TOURNAMENT_2023_119.jpg/960px-SMSC_FUTSAL_TOURNAMENT_2023_119.jpg',
      title: 'SMSC FUTSAL TOURNAMENT 2023 119',
      author: 'চিত্রকথক',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:SMSC_FUTSAL_TOURNAMENT_2023_119.jpg',
    },
  ],
};
