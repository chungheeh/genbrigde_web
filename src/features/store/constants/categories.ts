export interface Category {
  id: string;
  name: string;
}

export const storeCategories: Category[] = [
  {
    id: "cafe",
    name: "카페",
  },
  {
    id: "restaurant",
    name: "음식점",
  },
  {
    id: "convenience",
    name: "편의점",
  },
  {
    id: "shopping",
    name: "쇼핑",
  },
  {
    id: "beauty",
    name: "뷰티/패션",
  },
  {
    id: "bakery",
    name: "베이커리",
  },
  {
    id: "entertainment",
    name: "엔터테인먼트",
  },
]; 