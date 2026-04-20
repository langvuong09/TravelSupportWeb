import random
import mysql.connector
from faker import Faker
from datetime import datetime, timedelta

fake = Faker('vi_VN')

# ==========================================
# CONFIG
# ==========================================
NUM_USERS = 500

EVENT_TYPES = ["view", "click", "booking"]
EVENT_WEIGHTS = [0.6, 0.3, 0.1]  # realistic hơn

# ML weight (QUAN TRỌNG)
EVENT_SCORE = {
    "view": 1,
    "click": 2,
    "booking": 3
}

STYLE_POOL = ["Chợ", "Khu du lịch", "Di tích", "Chùa", "Khu sinh thái", "Hồ"]

# ==========================================
# DB CONNECT
# ==========================================
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database="travelsupport"
)
cursor = conn.cursor()

# ==========================================
# RESET DATA (TRÁNH DUPLICATE + SẠCH DATA)
# ==========================================
cursor.execute("SET FOREIGN_KEY_CHECKS=0")
cursor.execute("TRUNCATE user_interactions")
cursor.execute("TRUNCATE locations")
# cursor.execute("TRUNCATE users")
cursor.execute("DELETE FROM users WHERE role != 'ADMIN'")
cursor.execute("TRUNCATE provinces")
cursor.execute("TRUNCATE foods")
cursor.execute("TRUNCATE transport_types")
cursor.execute("SET FOREIGN_KEY_CHECKS=1")

# ==========================================
# PROVINCE
# ==========================================
cursor.execute("""
INSERT INTO provinces (province_id, name, latitude, longitude)
VALUES (%s, %s, %s, %s)
""", (21, "TP. Hồ Chí Minh", 10.7769, 106.7009))

# ==========================================
# TRANSPORT TYPES
# ==========================================
transport_types = [
    ("Xe máy", 2000.0),
    ("Xe ô tô", 15000.0),
    ("Xe khách", 5000.0)
]

cursor.executemany("""
INSERT INTO transport_types (name, cost_per_km)
VALUES (%s, %s)
""", transport_types)

# ==========================================
# USERS
# ==========================================
users = []
user_profiles = {}

for uid in range(1, NUM_USERS + 1):
    users.append((
        f"user{uid}",
        "123456",
        f"user{uid}@mail.com",
        fake.first_name(),
        fake.last_name(),
        fake.phone_number(),
        "user",
        fake.date_of_birth(minimum_age=18, maximum_age=50).isoformat(),
        f"https://i.pravatar.cc/150?img={uid}"
    ))

    user_profiles[uid] = {
        "style": random.choice(STYLE_POOL),
        "favorite_provinces": [21]
    }

cursor.executemany("""
INSERT INTO users (username,password,email,first_name,last_name,phone,role,birth_date,image)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
""", users)

# ==========================================
# LOCATIONS
# ==========================================
HCM_LOCATIONS = [
("Chợ Bến Thành","Chợ","Biểu tượng Sài Gòn","https://images.unsplash.com/photo-1576228459705-2a0c4cdb3c66"),
("Phố đi bộ Nguyễn Huệ","Chợ","Phố đi bộ trung tâm","https://images.unsplash.com/photo-1555921015-5532091f6026"),
("Nhà thờ Đức Bà","Di tích","Nhà thờ cổ","https://images.unsplash.com/photo-1583417311718-d7486e92ddfc"),
("Bưu điện Thành phố","Di tích","Kiến trúc Pháp","https://images.unsplash.com/photo-1528127269322-539801943592"),
("Dinh Độc Lập","Di tích","Di tích lịch sử","https://images.unsplash.com/photo-1504457047772-27faf1c00561"),

("Bitexco Tower","Khu du lịch","Skydeck","https://images.unsplash.com/photo-1502602898657-3e91760cbb34"),
("Landmark 81","Khu du lịch","Tòa nhà cao nhất","https://images.unsplash.com/photo-1548013146-72479768bada"),
("Chùa Vĩnh Nghiêm","Chùa","Chùa lớn","https://images.unsplash.com/photo-1526481280691-9069c8e9a4f9"),
("Chùa Ngọc Hoàng","Chùa","Chùa linh thiêng","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"),
("Thảo Cầm Viên","Khu sinh thái","Sở thú","https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"),

("Công viên Tao Đàn","Khu sinh thái","Công viên xanh","https://images.unsplash.com/photo-1469474968028-56623f02e42e"),
("Công viên Gia Định","Khu sinh thái","Công viên lớn","https://images.unsplash.com/photo-1506744038136-46273834b3fb"),
("Bùi Viện","Chợ","Nightlife","https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b"),
("Cầu Ánh Sao","Khu du lịch","Cầu đẹp","https://images.unsplash.com/photo-1504198453319-5ce911bafcde"),
("Đầm Sen","Khu du lịch","Công viên nước","https://images.unsplash.com/photo-1502082553048-f009c37129b9"),

("Bình Quới","Khu sinh thái","Sinh thái","https://images.unsplash.com/photo-1470770841072-f978cf4d019e"),
("Hồ Con Rùa","Hồ","Checkin","https://images.unsplash.com/photo-1482192596544-9eb780fc7f66"),
("Crescent Mall","Khu du lịch","Mall","https://images.unsplash.com/photo-1501785888041-af3ef285b470"),
("Nhà hát TP","Di tích","Opera","https://images.unsplash.com/photo-1467269204594-9661b134dd2b"),
("Bảo tàng Mỹ thuật","Di tích","Museum","https://images.unsplash.com/photo-1500534623283-312aade485b7"),

("Chợ Lớn","Chợ","Chinatown","https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"),
("Phố sách","Khu du lịch","Book street","https://images.unsplash.com/photo-1504198266285-165a38d86c9d"),
("Snow Town","Khu du lịch","Snow","https://images.unsplash.com/photo-1507525428034-b723cf961d3e"),
("Vietopia","Khu du lịch","Kids city","https://images.unsplash.com/photo-1501785888041-af3ef285b470"),
("Bến Bạch Đằng","Khu du lịch","River","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"),

("AEON Mall","Khu du lịch","Trung tâm thương mại","https://images.unsplash.com/photo-1507089947368-19c1da9775ae"),
("Vincom Center","Khu du lịch","TTTM trung tâm","https://images.unsplash.com/photo-1515168833906-d2a3b82b302a"),
("Takashimaya","Khu du lịch","Mall cao cấp","https://images.unsplash.com/photo-1521334884684-d80222895322"),
("Saigon Centre","Khu du lịch","Shopping mall","https://images.unsplash.com/photo-1441986300917-64674bd600d8"),
("SC VivoCity","Khu du lịch","Mall Phú Mỹ Hưng","https://images.unsplash.com/photo-1493809842364-78817add7ffb"),

("Công viên 23/9","Khu sinh thái","Công viên trung tâm","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"),
("Công viên Lê Văn Tám","Khu sinh thái","Không gian xanh","https://images.unsplash.com/photo-1501785888041-af3ef285b470"),
("Công viên Hoàng Văn Thụ","Khu sinh thái","Công viên lớn","https://images.unsplash.com/photo-1470770841072-f978cf4d019e"),
("Khu du lịch Văn Thánh","Khu sinh thái","Du lịch sinh thái","https://images.unsplash.com/photo-1469474968028-56623f02e42e"),
("Khu du lịch Tân Cảng","Khu sinh thái","Ven sông","https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b"),

("Chùa Giác Lâm","Chùa","Chùa cổ","https://images.unsplash.com/photo-1526481280691-9069c8e9a4f9"),
("Chùa Bà Thiên Hậu","Chùa","Chùa người Hoa","https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"),
("Chùa Pháp Hoa","Chùa","Chùa đẹp","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"),

("Nhà thờ Tân Định","Di tích","Nhà thờ hồng","https://images.unsplash.com/photo-1528127269322-539801943592"),
("Nhà thờ Huyện Sĩ","Di tích","Nhà thờ cổ","https://images.unsplash.com/photo-1504457047772-27faf1c00561"),

("Bảo tàng Lịch sử","Di tích","Lịch sử Việt Nam","https://images.unsplash.com/photo-1467269204594-9661b134dd2b"),
("Bảo tàng Áo Dài","Di tích","Văn hóa áo dài","https://images.unsplash.com/photo-1500534623283-312aade485b7"),

("Địa đạo Củ Chi","Di tích","Di tích chiến tranh","https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"),
("Khu du lịch Suối Tiên","Khu du lịch","Công viên giải trí","https://images.unsplash.com/photo-1502082553048-f009c37129b9"),
("Khu du lịch BCR","Khu du lịch","Outdoor","https://images.unsplash.com/photo-1470770841072-f978cf4d019e"),

("Cầu Thủ Thiêm","Khu du lịch","View skyline","https://images.unsplash.com/photo-1482192596544-9eb780fc7f66"),
("Hồ Bán Nguyệt","Hồ","Phú Mỹ Hưng","https://images.unsplash.com/photo-1501785888041-af3ef285b470"),
("Phố Nhật Bản","Khu du lịch","Ẩm thực Nhật","https://images.unsplash.com/photo-1491553895911-0055eca6402d"),
("Chợ Tân Định","Chợ","Chợ nổi tiếng","https://images.unsplash.com/photo-1576228459705-2a0c4cdb3c66"),
("Chợ Nhật Tảo","Chợ","Chợ bán đồ si","https://images.unsplash.com/photo-1576228459705-2a0c4cdb3c66")
]

SEASONS = ["Mùa xuân", "Mùa hạ", "Mùa thu", "Mùa đông"]

locations = []
for name, loc_type, desc, image in HCM_LOCATIONS:
    locations.append((
        name,
        desc,
        random.randint(2, 15) * 50000,
        image,
        random.choice(SEASONS),
        21,
        loc_type
    ))

cursor.executemany("""
INSERT INTO locations (name,description,estimated_cost,image,nice_time,province_id,type)
VALUES (%s,%s,%s,%s,%s,%s,%s)
""", locations)

# ==========================================
# FOODS
# ==========================================
HCM_FOODS = [
    ("Cơm Tấm Sài Gòn", "Món ăn sáng đặc trưng với sườn nướng, bì chả", 55000, "https://images.unsplash.com/photo-1598511757337-ea2cafc31752", 21, "Đặc sản"),
    ("Bánh Mì Huỳnh Hoa", "Bánh mì nổi tiếng nhất Sài Gòn với nhiều loại bơ, patê", 60000, "https://images.unsplash.com/photo-1509456592764-f254bc21f539", 21, "Đường phố"),
    ("Phở Hòa Pasteur", "Phở bò truyền thống lâu đời", 85000, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43", 21, "Truyền thống"),
    ("Bún Mắm Miền Tây", "Bún mắm đậm đà với tôm, mực, cá", 70000, "https://images.unsplash.com/photo-1512058560366-cd242dfe5cb3", 21, "Đặc sản"),
    ("Hủ Tiếu Nam Vang", "Hủ tiếu với tôm, trứng cút, thịt băm", 65000, "https://images.unsplash.com/photo-1547928576-a4a33237ecd0", 21, "Đặc sản"),
    ("Ốc Đào", "Thiên đường các món ốc", 150000, "https://images.unsplash.com/photo-1553621042-f6e147245754", 21, "Nhậu"),
    ("Bánh Xèo Ăn Là Ghiền", "Bánh xèo miền Tây giòn rụm", 120000, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", 21, "Truyền thống"),
    ("Chè Thái Ý Phương", "Món chè sầu riêng nổi tiếng phố Nguyễn Tri Phương", 35000, "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e", 21, "Tráng miệng")
]

cursor.executemany("""
INSERT INTO foods (name, description, estimated_price, image, province_id, type)
VALUES (%s, %s, %s, %s, %s, %s)
""", HCM_FOODS)

# ==========================================
# LOCATION MAP
# ==========================================
cursor.execute("SELECT location_id, type FROM locations")
location_map = {row[0]: row[1] for row in cursor.fetchall()}

# ==========================================
# USER INTERACTIONS
# ==========================================
interactions = []
seen = set()

for user_id, profile in user_profiles.items():
    for loc_id, loc_type in location_map.items():

        # Tăng mạnh probability để đạt > 10,000 rows
        prob = 0.15

        # nếu đúng sở thích -> tăng xác suất rất cao
        if profile["style"] == loc_type:
            prob += 0.55

        if random.random() < prob:
            # Tạo ngẫu nhiên từ 1-3 event cho mỗi location để tăng số lượng data
            num_events = random.randint(1, 3)
            selected_events = random.sample(EVENT_TYPES, num_events)

            for event in selected_events:
                key = (user_id, loc_id, event)
                if key in seen:
                    continue
                seen.add(key)

                val = EVENT_SCORE[event]

                created_at = datetime.now() - timedelta(days=random.randint(0, 30))

                interactions.append((user_id, loc_id, event, val, created_at))

cursor.executemany("""
INSERT INTO user_interactions (user_id,location_id,event_type,value,created_at)
VALUES (%s,%s,%s,%s,%s)
""", interactions)

# ==========================================
# DONE
# ==========================================
conn.commit()
cursor.close()
conn.close()

print(f"🔥 DONE: {NUM_USERS} users | {len(HCM_FOODS)} foods  | {len(locations)} locations | {len(interactions)} interactions")