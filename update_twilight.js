const fs = require('fs');

const data = JSON.parse(fs.readFileSync('twilight.json', 'utf8'));

const newComponents = [
    {
        key: "ratio-hero-123",
        title: { en: "Ratio Hero", ar: "بانر رئيسي (Ratio)" },
        icon: "sicon-star",
        path: "home.ratio-hero",
        is_default: true,
        fields: [
            {
                id: "title",
                type: "string",
                format: "text",
                label: "Main Title",
                value: "اصنع قهوتك<br>مثل المحترف"
            },
            {
                id: "subtitle",
                type: "string",
                format: "text",
                label: "Subtitle",
                value: "احصل على قهوتك المفضلة (الأفضل) مُوصَّلة إليك."
            },
            {
                id: "product_image",
                type: "string",
                format: "image",
                label: "Hero Product Image"
            },
            {
                id: "title_image",
                type: "string",
                format: "image",
                label: "Hero Title Image"
            }
        ]
    },
    {
        key: "ratio-marquee-123",
        title: { en: "Ratio Marquee", ar: "شريط متحرك (Ratio)" },
        icon: "sicon-star",
        path: "home.ratio-marquee",
        is_default: true,
        fields: []
    },
    {
        key: "ratio-products-123",
        title: { en: "Ratio Products", ar: "منتجات (Ratio)" },
        icon: "sicon-star",
        path: "home.ratio-products",
        type: "store.products",
        is_default: true,
        fields: [
            {
                id: "title",
                type: "string",
                format: "text",
                label: "Title",
                value: "جرّب ما يميّزنا"
            },
            {
                id: "subtitle",
                type: "string",
                format: "text",
                label: "Subtitle",
                value: "منتجاتنا"
            }
        ]
    },
    {
        key: "ratio-features-123",
        title: { en: "Ratio Features", ar: "مزايا (Ratio)" },
        icon: "sicon-star",
        path: "home.ratio-features",
        is_default: true,
        fields: [
            {
                id: "title",
                type: "string",
                format: "text",
                label: "Title",
                value: "القهوة الأفضل، في المكان الأفضل."
            },
            {
                id: "subtitle",
                type: "string",
                format: "text",
                label: "Subtitle",
                value: "اكتشف ما يجعلنا مميزين"
            },
            {
                id: "image",
                type: "string",
                format: "image",
                label: "Main Image"
            }
        ]
    },
    {
        key: "ratio-subscribe-123",
        title: { en: "Ratio Subscribe", ar: "نشرة بريدية (Ratio)" },
        icon: "sicon-star",
        path: "home.ratio-subscribe",
        is_default: true,
        fields: [
            {
                id: "title",
                type: "string",
                format: "text",
                label: "Title",
                value: "اشترك في النشرة البريدية"
            }
        ]
    },
    {
        key: "ratio-bestsellers-123",
        title: { en: "Ratio Bestsellers", ar: "الأكثر مبيعاً (Ratio)" },
        icon: "sicon-star",
        path: "home.ratio-bestsellers",
        type: "store.products",
        is_default: true,
        fields: [
            {
                id: "title",
                type: "string",
                format: "text",
                label: "Title",
                value: "الأكثر مبيعاً"
            },
            {
                id: "image",
                type: "string",
                format: "image",
                label: "Side Image"
            }
        ]
    },
    {
        key: "ratio-blogs-123",
        title: { en: "Ratio Blogs", ar: "المدونة (Ratio)" },
        icon: "sicon-star",
        path: "home.ratio-blogs",
        type: "store.blog",
        is_default: true,
        fields: [
            {
                id: "title",
                type: "string",
                format: "text",
                label: "Title",
                value: "أحدث مقالاتنا"
            }
        ]
    }
];

data.components = [...data.components, ...newComponents];
fs.writeFileSync('twilight.json', JSON.stringify(data, null, 4));
console.log('Successfully added custom components to twilight.json');
