import type { Post } from "../Types/Post";

export const posts: Post[] = [
  {
    id: "1",
    title: "رحلتي إلى الأقصر – تجربة لا تُنسى",
    content:
      
    `الأقصر من أجمل الأماكن التاريخية في مصر. زرت معبد الكرنك ووادي الملوك وكانت تجربة مبهرة. أنصح بزيارة المكان في الشتاء لتجنب الحرارة.الأقصر من أجمل الأماكن التاريخية في مصر. زرت معبد الكرنك ووادي الملوك وكانت تجربة مبهرة. أنصح بزيارة المكان في الشتاء لتجنب الحرارة.الأقصر من أجمل الأماكن التاريخية في مصر. زرت معبد الكرنك ووادي الملوك وكانت تجربة مبهرة. أنصح بزيارة المكان في الشتاء لتجنب الحرارة.`,
    likesCount: 120,
    commentsCount: 18,
    tags: [{ name: "الأقصر" }, { name: "آثار" }, { name: "سفر" }],
    image: {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
      name: "luxor_trip.jpg",
    },
    author: {
      name: "أحمد محمود",
      avatar: "https://i.pravatar.cc/40?img=7",
      tierName: "Gold",
      badgeColor: "#FFD700",
    },
  },
  {
    id: "2",
    title: "أفضل الأماكن في شرم الشيخ",
    content:
      "شرم الشيخ رائعة لعشاق البحر. جربت الغوص في رأس محمد وكانت تجربة مذهلة. الفنادق هناك ممتازة والخدمات رائعة.",
    likesCount: 95,
    commentsCount: 12,
    tags: [{ name: "شرم الشيخ" }, { name: "غوص" }, { name: "البحر الأحمر" }],
    image: {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
      name: "sharm_trip.jpg",
    },
    author: {
      name: "سارة علي",
      avatar: "https://i.pravatar.cc/40?img=3",
      tierName: "Silver",
      badgeColor: "#C0C0C0",
    },
  },
  {
    id: "3",
    title: "القاهرة القديمة – جولة في التاريخ",
    content:
      "زيارة القاهرة القديمة كانت ممتعة جدًا. خان الخليلي مليء بالحياة والأسواق التقليدية، والمساجد الأثرية جميلة جدًا.",
    likesCount: 80,
    commentsCount: 9,
    tags: [{ name: "القاهرة" }, { name: "خان الخليلي" }, { name: "ثقافة" }],
    image: {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
      name: "cairo_trip.jpg",
    },
    author: {
      name: "محمد حسن",
      avatar: "https://i.pravatar.cc/40?img=4",
      tierName: "Bronze",
      badgeColor: "#cd7f32",
    },
  },
  {
    id: "4",
    title: "نصائح لزيارة أسوان",
    content:
      "أسوان هادئة وجميلة جدًا. أنصح برحلة نيلية وزيارة جزيرة فيلة. الجو هناك دافئ طوال السنة.",
    likesCount: 60,
    commentsCount: 6,
    tags: [{ name: "أسوان" }, { name: "نيل" }, { name: "استرخاء" }],
    image: {
      url: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=600&q=80",
      name: "aswan_trip.jpg",
    },
    author: {
      name: "نور خالد",
      avatar: "https://i.pravatar.cc/40?img=5",
      tierName: "Silver",
      badgeColor: "#C0C0C0",
    },
  },
];
