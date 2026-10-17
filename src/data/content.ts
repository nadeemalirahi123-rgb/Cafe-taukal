const img = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export type Room = {
  id: number;
  name: string;
  urdu: string;
  price: number;
  guests: number;
  size: string;
  desc: string;
  images: string[];
  amenities: string[];
};

export const ROOMS: Room[] = [
  {
    id: 1,
    name: "Standard Room",
    urdu: "اسٹینڈرڈ روم",
    price: 4500,
    guests: 2,
    size: "220 sq ft",
    desc: "A calm, spotless retreat above the restaurant with a queen bed, split AC and a work desk — ideal for business travellers passing through Mirpurkhas.",
    images: [img("photo-1631049307264-da0ec9d70304"), img("photo-1590490360182-c33d57733427"), img("photo-1566665797739-1674de7a421a")],
    amenities: ["Air Conditioning", "Free Wi-Fi", "LED TV", "Hot Water", "Daily Housekeeping", "Room Service"],
  },
  {
    id: 2,
    name: "Deluxe Room",
    urdu: "ڈیلکس روم",
    price: 7500,
    guests: 3,
    size: "340 sq ft",
    desc: "Spacious king-bed room with a seating lounge, blackout curtains, mini fridge and complimentary breakfast served from our kitchen.",
    images: [img("photo-1611892440504-42a792e24d32"), img("photo-1618773928121-c32242e63f39"), img("photo-1582719478250-c89cae4dc85b")],
    amenities: ["King Bed", "Mini Fridge", "Free Breakfast", "Free Wi-Fi", "Smart TV", "Private Bath"],
  },
  {
    id: 3,
    name: "Family Suite",
    urdu: "فیملی سوئٹ",
    price: 12000,
    guests: 6,
    size: "560 sq ft",
    desc: "Two connected bedrooms, a family lounge and a private dining nook where our BBQ platters can be served in-room. Built for families and wedding guests.",
    images: [img("photo-1578683010236-d716f9a3f461"), img("photo-1595576508898-0ad5c879a061"), img("photo-1560448204-e02f11c3d0e2")],
    amenities: ["2 Bedrooms", "Family Lounge", "In-room Dining", "Free Parking", "Free Wi-Fi", "Prayer Mat & Qibla"],
  },
];

export const GALLERY = [
  { id: 1, cat: "BBQ", src: img("photo-1555939594-58d7cb561ad1"), alt: "Charcoal BBQ platter at Cafe Taukal" },
  { id: 2, cat: "Food", src: img("photo-1563379091339-03b21ab4a4f8"), alt: "Chicken biryani plate" },
  { id: 3, cat: "Rooms", src: img("photo-1611892440504-42a792e24d32"), alt: "Deluxe hotel room" },
  { id: 4, cat: "Interior", src: img("photo-1517248135467-4c7edcad34c4"), alt: "Restaurant dining hall" },
  { id: 5, cat: "BBQ", src: img("photo-1529692236671-f1f6cf9683ba"), alt: "Seekh kabab on grill" },
  { id: 6, cat: "Events", src: img("photo-1530103862676-de8c9debad1d"), alt: "Private event setup" },
  { id: 7, cat: "Food", src: img("photo-1455619452474-d2be8b1e70cd"), alt: "Mutton karahi" },
  { id: 8, cat: "Interior", src: img("photo-1552566626-52f8b828add9"), alt: "Cafe seating area" },
  { id: 9, cat: "Rooms", src: img("photo-1578683010236-d716f9a3f461"), alt: "Family suite" },
  { id: 10, cat: "Food", src: img("photo-1571934811356-5cc061b6821f"), alt: "Doodh patti chai" },
  { id: 11, cat: "Events", src: img("photo-1519225421980-715cb0215aed"), alt: "Wedding dinner hall" },
  { id: 12, cat: "BBQ", src: img("photo-1544025162-d76694265947"), alt: "Bihari kabab skewers" },
  { id: 13, cat: "Interior", src: img("photo-1514933651103-005eec06c04b"), alt: "Warm lounge lighting" },
  { id: 14, cat: "Rooms", src: img("photo-1590490360182-c33d57733427"), alt: "Standard room bed" },
  { id: 15, cat: "Food", src: img("photo-1546069901-ba9599a7e63c"), alt: "Haleem bowl" },
];

export const GALLERY_CATS = ["All", "Food", "BBQ", "Rooms", "Interior", "Events"];

export const TESTIMONIALS = [
  { name: "Imran Shaikh", city: "Mirpurkhas", text: "The best Malai Boti in the whole district. We order every Friday and it always arrives hot, fresh and perfectly spiced.", rating: 5 },
  { name: "Dr. Sana Memon", city: "Hyderabad", text: "Stayed two nights in the Deluxe Room while visiting family. Spotless, quiet and the breakfast paratha was outstanding.", rating: 5 },
  { name: "Abdul Rehman", city: "Tando Allahyar", text: "We booked the Family Suite and ordered the Family BBQ Platter in-room. Staff treated us like relatives, not customers.", rating: 5 },
  { name: "Hira Qureshi", city: "Karachi", text: "Finally a cafe in Mirpurkhas with real cappuccino and a proper Kashmiri chai. The interior is beautiful at night.", rating: 5 },
];

export const TIMELINE = [
  { year: "2009", title: "A single chai stall", text: "Taukal Sahab opens a roadside chai counter at Chandni Chowk with six stools and one kettle." },
  { year: "2013", title: "The charcoal pit", text: "Demand for evening BBQ leads to our first tandoor and charcoal grill — the smoke that built our name." },
  { year: "2017", title: "Full-service restaurant", text: "A 120-seat family hall opens with separate family cabins and a dedicated desi kitchen." },
  { year: "2021", title: "Rooms upstairs", text: "18 rooms and suites added for travellers, wedding guests and business visitors." },
  { year: "2026", title: "Online ordering", text: "WhatsApp ordering and room booking go live, delivering across Mirpurkhas city in 35 minutes." },
];

export const TEAM = [
  { name: "Chef Ghulam Abbas", role: "Head Chef — BBQ & Tandoor", img: img("photo-1577219491135-ce391730fb2c", 600), bio: "22 years on the charcoal pit. Keeper of the Taukal masala recipe." },
  { name: "Chef Noor Bhatti", role: "Desi Kitchen Lead", img: img("photo-1583394293214-28a5b42a5fc9", 600), bio: "Specialist in karahi, nihari and slow-cooked haleem." },
  { name: "Sadia Khan", role: "Guest Relations & Rooms", img: img("photo-1573497019940-1c28c88b4f3e", 600), bio: "Looks after every booking, from single nights to full-floor wedding parties." },
];

export const MAP_EMBED =
  "https://www.google.com/maps?q=Chandni%20Chowk%20Mirpurkhas%20Sindh&output=embed";
export const MAP_LINK = "https://www.google.com/maps/search/?api=1&query=Chandni+Chowk+Mirpurkhas+Sindh";
