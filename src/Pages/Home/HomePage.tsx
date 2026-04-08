
import HeroSectionLayout from "../../Components/Home/HeroSection/Layout";
import QAForum from "../../Components/Home/Q&ASection/Q&A";
import CommunitySection from "../../Components/Home/CommunitySection/Community";
import FeaturedPosts from "../../Components/Home/FeaturedPostSection/Featuerd";
import Footer from "../../Components/shared/Footer";
import { Title } from "react-head";
import InfiniteSlider from "../../Components/Home/Saperators/Saperator1";


// const posts = [
//   {
//     id: 1,
//     featured: true,
//     image:
//       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
//     tags: ["#Interface", "#Design", "#Presentation"],
//     author: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/40?img=1" },
//     badge: "Silver",
//     title: "10 Hidden Beaches You Must Visit in 2024",
//     excerpt:
//       "Discover the most breathtaking and secluded beachasdfsfasdfasfasdfafadfafs,dfnmsdnflsdnfd fnskadnfksn;vjksnjnsdjvnsdjnmost breathtaking and secluded beachasdfsfasdfasfasdfafadfafs,dfnmsdnflsdnfd fnskadnfksn;vjksnjnsdjvnsdjnvsanvksnvjnsadjkvnsnvjksafnvkses around the world. From crystal clear watmost breathtaking and secluded beachasdfsfasdfasfasdfafadfafs,dfnmsdnflsdnfd fnskadnfksn;vjksnjnsdjvnsdjnvsanvksnvjnsadjkvnsnvjksafnvkses around the world. From crystal clear watvsanvksnvjnsadjkvnsnvjksafnvkses around the world. From crystal clear waters to pristine white sand, these destinations will take your breath away...",
//     likes: "1.2K",
//     comments: 342,
//   },
//   //   {
//   //                 "id": "40baf6ab-2f3e-4ee4-b6a1-b961e1554479",
//   //                 "title": "Egypt",
//   //                 "content": "Egypt is greate country. It's full of ancient places. Many tourists visit it all the year.",
//   //                 "likesCount": 0,
//   //                 "commentsCount": 0,
//   //                 "tags": [
//   //                     {
//   //                         "name": "Egypt"
//   //                     },
//   //                     {
//   //                         "name": "Pyramids"
//   //                     }
//   //                 ],
//   //                 "image": {
//   //                     "url": "https://res.cloudinary.com/dwosgptlb/image/upload/v1773630829/posts/1773630750174-3ad80f0c2482-gemini_generated_image_9go47m9.jpg",
//   //                     "name": "Gemini_Generated_Image_9go47m9go47m9go4.png"
//   //                 },
//   //                 "author": {
//   //                     "name": "Ali Magdy",
//   //                     "avatar": "https://lh3.googleusercontent.com/a/ACg8ocJ8lO4FuIth060aQBQnjAaFIOjsO4El77jPV0C5ufophaOaVA=s96-c",
//   //                     "tierName": "Silver",
//   //                     "badgeColor": "#7a6d6dff"
//   //                 }
//   //             },
//   {
//     id: 2,
//     image:
//       "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
//     tags: ["#Interface", "#Design"],
//     author: { name: "Mike Chen", avatar: "https://i.pravatar.cc/40?img=3" },
//     badge: "Silver",
//     title: "Alpine Adventures Guide",
//     excerpt: "Essential tips for mountain hiking...",
//     likes: 856,
//     comments: 124,
//   },
//   {
//     id: 3,
//     image:
//       "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
//     tags: ["#Presentation"],
//     author: { name: "Emma Wilson", avatar: "https://i.pravatar.cc/40?img=5" },
//     badge: "Gold",
//     title: "Street Food Paradise",
//     excerpt: "Best food markets around the world...",
//     likes: "2.1K",
//     comments: 445,
//   },
//   {
//     id: 4,
//     image:
//       "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=600&q=80",
//     tags: ["#Research", "#Presentation"],
//     author: { name: "David Brown", avatar: "https://i.pravatar.cc/40?img=7" },
//     badge: "Bronze",
//     title: "Historic Castles Tour",
//     excerpt: "Explore medieval architecture...",
//     likes: "1.5K",
//     comments: 289,
//   },
// ];

export default  function HomePage() {

  return (
    <>
     <Title>الرئيسية - مزاعيط العرب</Title>
      <HeroSectionLayout />
      <FeaturedPosts  />
      <InfiniteSlider />
      <CommunitySection  />
      <QAForum  />
      <Footer  />
    </>
  );
}
