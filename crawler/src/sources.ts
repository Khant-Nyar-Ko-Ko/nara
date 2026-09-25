export interface FacebookNewsSource {
  id: string;
  name: string;
  // Use Facebook page/profile URLs with apify/facebook-posts-scraper.
  facebookUrl: string;
}

export const FACEBOOK_NEWS_SOURCES: FacebookNewsSource[] = [
  {
    id: "bangkok-post",
    name: "Bangkok Post",
    facebookUrl: "https://www.facebook.com/BangkokPost",
  },
  {
    id: "khaosod-english",
    name: "Khaosod English",
    facebookUrl: "https://www.facebook.com/KhaosodEnglish",
  }
  
  // {
  //   id: "matichon",
  //   name: "Matichon",
  //   facebookUrl: "https://www.facebook.com/MatichonOnline",
  // },
  // {
  //   id: "thairath",
  //   name: "Thai Rath",
  //   facebookUrl: "https://www.facebook.com/thairath",
  // },
  // {
  //   id: "dailynews",
  //   name: "Dailynews",
  //   facebookUrl: "https://www.facebook.com/dailynewsonlinefan",
  // }
];
