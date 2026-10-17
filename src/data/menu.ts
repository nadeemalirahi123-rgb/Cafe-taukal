export type MenuItem = {
  id: number;
  name: string;
  urdu: string;
  category: string;
  price: number;
  desc: string;
  image: string;
  veg?: boolean;
  spicy?: boolean;
  bestseller?: boolean;
};

export const CATEGORIES = [
  "BBQ",
  "Desi Food",
  "Fast Food",
  "Cafe & Drinks",
  "Desserts",
  "Deals",
] as const;

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const MENU: MenuItem[] = [
  { id: 1, name: "Chicken Tikka", urdu: "چکن تکہ", category: "BBQ", price: 700, desc: "Charcoal-grilled leg quarter marinated 12 hours in yoghurt, lemon and red chilli.", image: img("photo-1599487488170-d11ec9c172f0"), spicy: true, bestseller: true },
  { id: 2, name: "Seekh Kabab (6 pcs)", urdu: "سیخ کباب", category: "BBQ", price: 850, desc: "Hand-minced beef with green chilli, coriander and secret Taukal masala.", image: img("photo-1529692236671-f1f6cf9683ba"), spicy: true },
  { id: 3, name: "Malai Boti", urdu: "ملائی بوٹی", category: "BBQ", price: 950, desc: "Creamy, mild chicken boti finished with butter and white pepper.", image: img("photo-1567188040759-fb8a883dc6d8"), bestseller: true },
  { id: 4, name: "Beef Bihari Kabab", urdu: "بہاری کباب", category: "BBQ", price: 1050, desc: "Thin beef strips, papaya-tenderised, smoked over charcoal.", image: img("photo-1544025162-d76694265947"), spicy: true },
  { id: 5, name: "Mutton Karahi (Full)", urdu: "مٹن کڑاہی", category: "Desi Food", price: 2200, desc: "Fresh mutton cooked in tomatoes, ginger and whole spices in a cast-iron karahi.", image: img("photo-1455619452474-d2be8b1e70cd"), spicy: true, bestseller: true },
  { id: 6, name: "Chicken Handi", urdu: "چکن ہانڈی", category: "Desi Food", price: 1400, desc: "Boneless chicken simmered in cream, cashew and brown onion gravy.", image: img("photo-1565557623262-b51c2513a641") },
  { id: 7, name: "Chicken Biryani", urdu: "چکن بریانی", category: "Desi Food", price: 450, desc: "Long-grain sella rice layered with Sindhi-style masala and kewra.", image: img("photo-1563379091339-03b21ab4a4f8"), spicy: true, bestseller: true },
  { id: 8, name: "Beef Nihari", urdu: "نہاری", category: "Desi Food", price: 650, desc: "Overnight slow-cooked shank stew with ginger, chilli and fresh lemon.", image: img("photo-1574653853027-5382a3d23a7d"), spicy: true },
  { id: 9, name: "Haleem", urdu: "حلیم", category: "Desi Food", price: 400, desc: "Eight lentils and wheat pounded with tender beef, served with fried onion.", image: img("photo-1546069901-ba9599a7e63c") },
  { id: 10, name: "Daal Makhani", urdu: "دال مکھنی", category: "Desi Food", price: 380, desc: "Black lentils slow-cooked overnight with butter and cream.", image: img("photo-1585937421612-70a008356fbe"), veg: true },
  { id: 11, name: "Roghni Naan", urdu: "روغنی نان", category: "Desi Food", price: 90, desc: "Tandoor-baked naan brushed with ghee and sesame.", image: img("photo-1601050690597-df0568f70950"), veg: true },
  { id: 12, name: "Zinger Burger", urdu: "زنگر برگر", category: "Fast Food", price: 520, desc: "Crispy buttermilk chicken fillet, lettuce and signature mayo.", image: img("photo-1568901346375-23c9450c58cd") },
  { id: 13, name: "Chicken Tikka Pizza (Large)", urdu: "پیزا", category: "Fast Food", price: 1450, desc: "Hand-stretched dough, tikka chunks, capsicum and mozzarella.", image: img("photo-1513104890138-7c749659a591"), spicy: true },
  { id: 14, name: "Loaded Fries", urdu: "فرائز", category: "Fast Food", price: 420, desc: "Crispy fries with cheese sauce, jalapeño and smoked chicken.", image: img("photo-1573080496219-bb080dd4f877") },
  { id: 15, name: "Club Sandwich", urdu: "سینڈوچ", category: "Fast Food", price: 480, desc: "Triple-decker with chicken, egg, cheese and fries on the side.", image: img("photo-1528735602780-2552fd46c7af") },
  { id: 16, name: "Doodh Patti Chai", urdu: "دودھ پتی", category: "Cafe & Drinks", price: 150, desc: "Full-cream tea boiled slowly the Mirpurkhas way.", image: img("photo-1571934811356-5cc061b6821f"), veg: true, bestseller: true },
  { id: 17, name: "Karak Chai", urdu: "کڑک چائے", category: "Cafe & Drinks", price: 180, desc: "Strong cardamom tea with a thick malai layer.", image: img("photo-1544787219-7f47ccb76574"), veg: true },
  { id: 18, name: "Cappuccino", urdu: "کیپوچینو", category: "Cafe & Drinks", price: 350, desc: "Double-shot espresso with velvet steamed milk and cocoa dust.", image: img("photo-1572442388796-11668a67e53d"), veg: true },
  { id: 19, name: "Fresh Lime Mint", urdu: "لیمو پودینہ", category: "Cafe & Drinks", price: 220, desc: "Hand-squeezed lemon, mint leaves and crushed ice.", image: img("photo-1621263764928-df1444c5e859"), veg: true },
  { id: 20, name: "Kashmiri Chai", urdu: "کشمیری چائے", category: "Cafe & Drinks", price: 260, desc: "Pink tea topped with pistachio and almond slivers.", image: img("photo-1578374173705-969cbe6f2d6b"), veg: true },
  { id: 21, name: "Gulab Jamun (2 pcs)", urdu: "گلاب جامن", category: "Desserts", price: 200, desc: "Warm khoya dumplings soaked in cardamom syrup.", image: img("photo-1601050690117-94f5f6fa8bd7"), veg: true },
  { id: 22, name: "Kheer", urdu: "کھیر", category: "Desserts", price: 250, desc: "Slow-cooked rice pudding with saffron and dry fruit.", image: img("photo-1605190557072-6d1a8d96d2c1"), veg: true },
  { id: 23, name: "Chocolate Lava Cake", urdu: "لاوا کیک", category: "Desserts", price: 420, desc: "Molten centre chocolate cake served with vanilla scoop.", image: img("photo-1624353365286-3f8d62daad51"), veg: true },
  { id: 24, name: "Family BBQ Platter", urdu: "فیملی پلیٹر", category: "Deals", price: 3200, desc: "2 tikka, 6 seekh kabab, malai boti, 4 naan, raita & salad. Serves 4-5.", image: img("photo-1555939594-58d7cb561ad1"), spicy: true, bestseller: true },
  { id: 25, name: "Taukal Duo Deal", urdu: "ڈوو ڈیل", category: "Deals", price: 1650, desc: "Chicken handi, 2 naan, 2 drinks and 2 gulab jamun.", image: img("photo-1504674900247-0877df9cc836") },
  { id: 26, name: "Chai & Paratha Deal", urdu: "چائے پراٹھا", category: "Deals", price: 450, desc: "2 doodh patti, 2 desi ghee parathas and omelette.", image: img("photo-1517248135467-4c7edcad34c4"), veg: true },
];

export const DELIVERY_FEE = 120;
export const FREE_DELIVERY_OVER = 2000;
export const WHATSAPP = "923438276211";
