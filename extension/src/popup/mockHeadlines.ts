import type { Headline } from "../types";

const fetchedAt = new Date(Date.now() - 8 * 60 * 1000).toISOString();

export const MOCK_HEADLINES: Headline[] = [
  {
    id: "mock-1",
    source: "Bangkok Post",
    category: "Politics",
    summary: "Cabinet approves 2027 budget framework",
    url: "https://www.bangkokpost.com/",
    fetchedAt,
  },
  {
    id: "mock-2",
    source: "Thai PBS World",
    category: "Economy",
    summary: "Baht strengthens to a nine-month high",
    url: "https://world.thaipbs.or.th/",
    fetchedAt: new Date(Date.now() - 21 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-3",
    source: "The Nation",
    category: "Bangkok",
    summary: "MRT Purple Line extension opens for trial runs",
    url: "https://www.nationthailand.com/",
    fetchedAt: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-4",
    source: "Khaosod English",
    category: "Weather",
    summary: "Heavy rain warning for 18 northern provinces",
    url: "https://www.khaosodenglish.com/",
    fetchedAt: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-5",
    source: "Prachatai",
    category: "Society",
    summary: "New community projects bring local voices together",
    url: "https://prachataienglish.com/",
    fetchedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];