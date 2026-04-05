export type ExploreVenue = {
  id: string;
  name: string;
  address: string;
  photoUrl: string | null;
  rating: number | null;
  totalReviews: number;
  priceLevel: number | null;
  isOpenNow: boolean | null;
  distanceMeters?: number;
  crowdLabel: string;
  buzzScore: number;
};

export async function getExploreVenues(): Promise<ExploreVenue[]> {
  return [
    {
      id: "1",
      name: "Velvet Circuit",
      address: "123 Downtown Ave, Newark, NJ",
      photoUrl: null,
      rating: 4.4,
      totalReviews: 328,
      priceLevel: 3,
      isOpenNow: true,
      distanceMeters: 1800,
      crowdLabel: "Packed",
      buzzScore: 86,
    },
    {
      id: "2",
      name: "Neon Harbor Rooftop",
      address: "88 River St, Jersey City, NJ",
      photoUrl: null,
      rating: 4.2,
      totalReviews: 211,
      priceLevel: 2,
      isOpenNow: true,
      distanceMeters: 2600,
      crowdLabel: "Active",
      buzzScore: 74,
    }
  ];
}