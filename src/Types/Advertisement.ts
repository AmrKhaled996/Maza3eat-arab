        // "ads":
        //     {
        //         "id": "2d824829-3dc2-4bf6-be4e-b859d97eddfe",
        //         "position": "top",
        //         "title": "Travel Gear Sale 2",
        //         "text": "Premium backpacks and accessories up to 60% off",
        //         "link": "http://www.maza3eat-arab/contact",
        //         "buttonText": "Explore Deals",
        //         "image": {
        //             "url": "https://res.cloudinary.com/dwosgptlb/image/upload/v1773630829/posts/1773630750174-3ad80f0c2482-gemini_generated_image_9go47m9.jpg",
        //             "name": "Gemini_Generated_Image_9go47m9go47m9go4.png"
        //         }
        //     },

import type { Image } from "./Image";

        export interface Ad {
            id: string;
            position: string;
            title: string;
            text: string;
            link: string;
            buttonText: string;
            image?: Image
        }