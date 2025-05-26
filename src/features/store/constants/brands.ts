import { Brand } from "./types";
import { addMonths } from "date-fns";

// 유효기간 설정을 위한 함수
const getExpiryDate = (monthsFromNow: number) => {
  return addMonths(new Date(), monthsFromNow).toISOString();
};

export const storeBrands: Brand[] = [
  {
    id: "starbucks",
    name: "스타벅스",
    category: "cafe",
    logoUrl: "https://picsum.photos/seed/starbucks-logo-circle/200",
    giftCards: [
      {
        id: "starbucks-1",
        name: "아메리카노 Tall",
        price: 4500,
        imageUrl: "https://picsum.photos/seed/starbucks-cup-brown/300/200",
        expiryDate: getExpiryDate(6),
      },
      {
        id: "starbucks-2",
        name: "카페 라떼 Tall",
        price: 5000,
        imageUrl: "https://picsum.photos/seed/starbucks-gift-card-green/300/200",
        expiryDate: getExpiryDate(6),
      },
      {
        id: "starbucks-3",
        name: "자바칩 프라푸치노 Tall",
        price: 6300,
        imageUrl: "https://picsum.photos/seed/starbucks-tumbler-black/300/200",
        expiryDate: getExpiryDate(6),
      },
    ],
  },
  {
    id: "ediya",
    name: "이디야커피",
    category: "cafe",
    logoUrl: "https://picsum.photos/seed/ediya-logo-blue/200",
    giftCards: [
      {
        id: "ediya-1",
        name: "아메리카노 R",
        price: 3500,
        imageUrl: "https://picsum.photos/seed/ediya-gift-card-blue/300/200",
        expiryDate: getExpiryDate(6),
      },
      {
        id: "ediya-2",
        name: "카페 라떼 R",
        price: 4000,
        imageUrl: "https://picsum.photos/seed/ediya-coffee-cup-blue/300/200",
        expiryDate: getExpiryDate(6),
      },
    ],
  },
  {
    id: "mcdonalds",
    name: "맥도날드",
    category: "restaurant",
    logoUrl: "https://picsum.photos/seed/mcdonalds-m-logo/200",
    giftCards: [
      {
        id: "mcdonalds-1",
        name: "빅맥 세트",
        price: 7500,
        imageUrl: "https://picsum.photos/seed/mcdonalds-gift-card-red/300/200",
        expiryDate: getExpiryDate(3),
      },
      {
        id: "mcdonalds-2",
        name: "맥너겟 10조각",
        price: 5500,
        imageUrl: "https://picsum.photos/seed/mcdonalds-coupon-card/300/200",
        expiryDate: getExpiryDate(3),
      },
    ],
  },
  {
    id: "bhc",
    name: "BHC 치킨",
    category: "restaurant",
    logoUrl: "https://picsum.photos/seed/bhc-logo-yellow/200",
    giftCards: [
      {
        id: "bhc-1",
        name: "뿌링클 + 콜라",
        price: 19000,
        imageUrl: "https://picsum.photos/seed/chicken-gift-card-orange/300/200",
        expiryDate: getExpiryDate(3),
      },
      {
        id: "bhc-2",
        name: "맵스터 + 콜라",
        price: 19500,
        imageUrl: "https://picsum.photos/seed/chicken-coupon-red/300/200",
        expiryDate: getExpiryDate(3),
      },
    ],
  },
  {
    id: "cu",
    name: "CU 편의점",
    category: "convenience",
    logoUrl: "https://picsum.photos/seed/cu-purple-logo/200",
    giftCards: [
      {
        id: "cu-1",
        name: "5천원 금액권",
        price: 5000,
        imageUrl: "https://picsum.photos/seed/cu-gift-card-purple-5000/300/200",
        expiryDate: getExpiryDate(12),
      },
      {
        id: "cu-2",
        name: "1만원 금액권",
        price: 10000,
        imageUrl: "https://picsum.photos/seed/cu-gift-card-purple-10000/300/200",
        expiryDate: getExpiryDate(12),
      },
    ],
  },
  {
    id: "gs25",
    name: "GS25",
    category: "convenience",
    logoUrl: "https://picsum.photos/seed/gs25-blue-logo/200",
    giftCards: [
      {
        id: "gs25-1",
        name: "5천원 금액권",
        price: 5000,
        imageUrl: "https://picsum.photos/seed/gs25-gift-card-blue-5000/300/200",
        expiryDate: getExpiryDate(12),
      },
      {
        id: "gs25-2",
        name: "1만원 금액권",
        price: 10000,
        imageUrl: "https://picsum.photos/seed/gs25-gift-card-orange-10000/300/200",
        expiryDate: getExpiryDate(12),
      },
    ],
  },
  {
    id: "olive-young",
    name: "올리브영",
    category: "beauty",
    logoUrl: "https://picsum.photos/seed/olive-green-logo/200",
    giftCards: [
      {
        id: "olive-1",
        name: "1만원 금액권",
        price: 10000,
        imageUrl: "https://picsum.photos/seed/oliveyoung-gift-card-green/300/200",
        expiryDate: getExpiryDate(12),
      },
      {
        id: "olive-2",
        name: "3만원 금액권",
        price: 30000,
        imageUrl: "https://picsum.photos/seed/oliveyoung-gift-card-30000/300/200",
        expiryDate: getExpiryDate(12),
      },
    ],
  },
  {
    id: "sinshegae",
    name: "신세계백화점",
    category: "shopping",
    logoUrl: "https://picsum.photos/seed/shinsegae-logo/200",
    giftCards: [
      {
        id: "sinshegae-1",
        name: "신세계 상품권 5만원권",
        price: 50000,
        imageUrl: "https://picsum.photos/seed/shinsegae-gift-card-50000/300/200",
        expiryDate: getExpiryDate(36),
      },
      {
        id: "sinshegae-2",
        name: "신세계 상품권 10만원권",
        price: 100000,
        imageUrl: "https://picsum.photos/seed/shinsegae-gift-card-100000/300/200",
        expiryDate: getExpiryDate(36),
      },
    ],
  },
  {
    id: "emart",
    name: "이마트",
    category: "shopping",
    logoUrl: "https://picsum.photos/seed/emart-logo-yellow/200",
    giftCards: [
      {
        id: "emart-1",
        name: "이마트 상품권 3만원권",
        price: 30000,
        imageUrl: "https://picsum.photos/seed/emart-gift-card-yellow-30000/300/200",
        expiryDate: getExpiryDate(36),
      },
      {
        id: "emart-2",
        name: "이마트 상품권 5만원권",
        price: 50000,
        imageUrl: "https://picsum.photos/seed/emart-gift-card-yellow-50000/300/200",
        expiryDate: getExpiryDate(36),
      },
    ],
  },
  {
    id: "cgv",
    name: "CGV",
    category: "entertainment",
    logoUrl: "https://picsum.photos/seed/cgv-logo-red/200",
    giftCards: [
      {
        id: "cgv-1",
        name: "일반 영화 관람권",
        price: 12000,
        imageUrl: "https://picsum.photos/seed/cgv-movie-ticket-red/300/200",
        expiryDate: getExpiryDate(6),
      },
      {
        id: "cgv-2",
        name: "팝콘 + 음료 세트",
        price: 10000,
        imageUrl: "https://picsum.photos/seed/cgv-combo-ticket-red/300/200",
        expiryDate: getExpiryDate(3),
      },
    ],
  },
  {
    id: "megabox",
    name: "메가박스",
    category: "entertainment",
    logoUrl: "https://picsum.photos/seed/megabox-logo-purple/200",
    giftCards: [
      {
        id: "megabox-1",
        name: "일반 영화 관람권",
        price: 12000,
        imageUrl: "https://picsum.photos/seed/megabox-movie-ticket-purple/300/200",
        expiryDate: getExpiryDate(6),
      },
      {
        id: "megabox-2",
        name: "팝콘 + 음료 세트",
        price: 10000,
        imageUrl: "https://picsum.photos/seed/megabox-combo-ticket/300/200",
        expiryDate: getExpiryDate(3),
      },
    ],
  },
  {
    id: "baskinrobbins",
    name: "배스킨라빈스",
    category: "cafe",
    logoUrl: "https://picsum.photos/seed/baskinrobbins-logo/200",
    giftCards: [
      {
        id: "baskinrobbins-1",
        name: "배스킨라빈스 모바일상품권 5천원",
        price: 5000,
        imageUrl: "https://picsum.photos/seed/baskinrobbins-gift-card-blue/300/200",
        expiryDate: getExpiryDate(12),
      },
      {
        id: "baskinrobbins-2",
        name: "배스킨라빈스 모바일상품권 1만원",
        price: 10000,
        imageUrl: "https://picsum.photos/seed/baskinrobbins-gift-card-pink/300/200",
        expiryDate: getExpiryDate(12),
      },
    ],
  },
  {
    id: "parisbaguette",
    name: "파리바게트",
    category: "bakery",
    logoUrl: "https://picsum.photos/seed/paris-baguette-logo/200",
    giftCards: [
      {
        id: "parisbaguette-1",
        name: "2025 케이크 교환권",
        price: 25000,
        imageUrl: "https://picsum.photos/seed/paris-baguette-cake-ticket/300/200",
        expiryDate: getExpiryDate(12),
      },
      {
        id: "parisbaguette-2",
        name: "파리바게트 1만원권",
        price: 10000,
        imageUrl: "https://picsum.photos/seed/paris-baguette-gift-card/300/200",
        expiryDate: getExpiryDate(12),
      },
    ],
  },
]; 