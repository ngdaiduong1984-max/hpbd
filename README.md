# 🎆 WOW! WOW! WOW! — Thiệp sinh nhật điện tử cho Linh Nhi

Microsite thiệp sinh nhật tương tác, mobile-first, concept **"Một tín hiệu đặc biệt
từ vũ trụ"** — gửi đến đúng người đặc biệt nhất hôm nay. Phong cách *futuristic neon
celebration*, dẫn dắt bằng tông **hồng**, hoành tráng & bùng nổ, 3 cao trào rõ ràng.

> Xây theo bản đặc tả "WOW! WOW! WOW!" (8 phân cảnh, 3 cao trào: reveal tên →
> Birthday Mode → pháo hoa sau khi thổi nến).

## ▶️ Chạy thử
Mở thẳng `index.html` bằng trình duyệt, **hoặc** chạy server tĩnh để chuẩn nhất:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

Trải nghiệm tốt nhất trên **điện thoại** (màn dọc). Bấm **🔊** để bật âm thanh
(không tự phát trước khi bạn chạm — theo chuẩn trình duyệt).

## 🎬 8 phân cảnh
1. **Tín hiệu bí mật** — radar quét, chữ đánh máy, nút *Mở tín hiệu bí mật*.
2. **Reveal Linh Nhi** — ảnh hologram + tên cỡ lớn (cao trào 1).
3. **Birthday Mode** — bật chế độ, đổi nền, confetti hai bên (cao trào 2).
4. **Ba khoảnh khắc WOW** — công việc · tình cảm · sức khoẻ rực rỡ.
5. **Lời chúc + gallery** — album polaroid kỷ niệm, lời chúc cá nhân hóa.
6. **Khoe tuổi tự hào** — đếm số lên 25, "Cấp độ 25 đã mở khóa".
7. **Thổi nến** — nhấn giữ 1.5s để thổi & gửi điều ước (có rung phản hồi).
8. **Đại tiệc kết thúc** — đếm ngược 3-2-1, **tên vẽ bằng pháo hoa**, **mưa ảnh
   kỷ niệm**, **lắc/chạm để bắn thêm pháo hoa**, thư tay, xem lại & chia sẻ.

## ✨ Điểm "kịch khung"
- Tên Linh Nhi được **vẽ bằng hàng trăm hạt pháo hoa** ở finale.
- **Mưa ảnh** thật rơi trong màn pháo hoa cuối.
- **Lắc điện thoại** (hoặc chạm màn hình) để bắn thêm pháo hoa.
- Nhạc nền + hiệu ứng âm thanh **tổng hợp trực tiếp bằng Web Audio** (miễn phí
  bản quyền, chạy offline), chuyển từ *bí ẩn* sang *celebration*.

## 🛠️ Tùy biến — chỉ sửa 1 file
Mọi nội dung nằm trong **`assets/js/config.js`** (tên, tuổi, lời chúc, thư tay,
màu, danh sách ảnh, nhạc…). Đổi người nhận chỉ cần sửa file này.

## 📸 Thay ảnh thật
Xem **`assets/photos/README.md`** — copy 6 ảnh vào thư mục, giữ đúng tên là xong.
Hiện đang dùng ảnh placeholder đẹp để chạy được ngay.

## ♿ Hiệu năng & tiếp cận
- Hỗ trợ `prefers-reduced-motion`, nút tắt âm thanh, focus rõ, nhãn nút đầy đủ.
- Giới hạn particle theo thiết bị, canvas nhẹ, không autoplay âm thanh.
- Không nhấp nháy cường độ cao.

## 🧱 Cấu trúc
```
index.html
assets/
├─ css/styles.css     # giao diện, responsive, glassmorphism, reduced-motion
├─ js/config.js       # ★ dữ liệu cá nhân hóa (nguồn duy nhất)
├─ js/audio.js        # nhạc nền + SFX tổng hợp Web Audio
├─ js/effects.js      # canvas: particle, confetti, pháo hoa, tên-pháo-hoa
├─ js/app.js          # máy trạng thái 8 cảnh + tương tác
└─ photos/            # ảnh (placeholder .svg → thay ảnh thật)
```
