/* =====================================================================
 *  CẤU HÌNH CÁ NHÂN HÓA — NGUỒN DỮ LIỆU DUY NHẤT
 *  Muốn đổi người nhận / nội dung / ảnh / màu: CHỈ sửa file này.
 *  (Theo đặc tả mục 10 — không viết dữ liệu cố định vào từng màn hình.)
 * ===================================================================== */
window.CARD_CONFIG = {

  /* --- Nhân vật chính --- */
  tenNguoiNhan: "Linh Nhi",
  bietDanh: "",                 // để trống nếu không có
  tenNguoiGui: "Nguyên Phong",

  /* --- Ngày sinh & tuổi --- */
  ngaySinh: "19/06",            // hiển thị; đổi nếu cần
  tuoi: 25,
  hienTuoi: true,               // true = khoe tuổi tự hào

  /* --- Màu chủ đạo (Linh Nhi thích màu hồng) --- */
  mauChuDao: "#FF3CAC",         // hồng neon dẫn dắt
  mauPhu1: "#FF6FB5",           // hồng pastel
  mauPhu2: "#8B5CF6",           // tím điện
  mauPhu3: "#22D3EE",           // cyan
  mauVang: "#FFD166",           // vàng ánh kim (finale)

  /* --- Ảnh (xem assets/photos/README.md để thay ảnh thật) --- */
  anhChanDung: "assets/photos/portrait.svg",   // dùng cho màn reveal (Cảnh 2)
  danhSachAnh: [
    { src: "assets/photos/mem-concert.svg", caption: "Cháy hết mình giữa biển ánh sáng 🎤" },
    { src: "assets/photos/mem-work.svg",    caption: "Bản lĩnh nơi xứ Hàn — KPR Bright Bell 💼" },
    { src: "assets/photos/mem-snow.svg",    caption: "Chinh phục Ngọc Long Tuyết Sơn 4506m ❄️" },
    { src: "assets/photos/mem-sakura.svg",  caption: "Dịu dàng dưới mùa hoa anh đào 🌸" },
    { src: "assets/photos/mem-berry.svg",   caption: "Rạng rỡ như những ngày đẹp nhất 🍒" }
  ],

  /* --- Âm thanh --- */
  // Nhạc nền được TỔNG HỢP trực tiếp bằng Web Audio (miễn phí bản quyền,
  // chạy offline). Muốn dùng nhạc riêng: điền đường dẫn file mp3 vào đây.
  nhacNenUrl: "",

  /* --- Lời thoại theo cảnh --- */
  intro: [
    "Đang kết nối với vũ trụ…",
    "Đang quét tìm một nhân vật cực kỳ đặc biệt…",
    "Tín hiệu đã được xác định!"
  ],

  // Ba khoảnh khắc WOW (công việc · tình cảm · sức khoẻ rực rỡ)
  wow: [
    "WOW! — Một tuổi mới với sự nghiệp bùng nổ, công việc thuận buồm xuôi gió!",
    "WOW! — Tình cảm ngọt ngào, niềm vui ngập tràn, đi đâu cũng có người thương!",
    "WOW! — Sức khoẻ rực rỡ và… tiền vào như nước, ví lúc nào cũng đầy! 💸"
  ],

  // Khoe tuổi tự hào (Cảnh 6)
  ageTitle: "CẤP ĐỘ 25 ĐÃ MỞ KHÓA!",
  ageQuip: "Tuổi 25 — xinh đẹp, bản lĩnh và chuẩn bị giàu to! ✨",

  // Lời chúc chính (Cảnh 5)
  loiChuc:
    "Chúc Linh Nhi tuổi 25 thật rực rỡ — công việc bùng nổ, tình cảm ngọt ngào " +
    "và sức khoẻ luôn tràn đầy. Mong những nơi bạn muốn đi đều có dấu chân bạn, " +
    "những điều bạn mong đều thành hiện thực, và tài khoản thì… cứ thế mà nhảy số. " +
    "Mỗi ngày sắp tới, mong bạn luôn có lý do để mỉm cười và thốt lên: WOW!",

  // Thông điệp sau khi thổi nến
  thongDiepSauThoiNen: "Điều ước đã được gửi tới vũ trụ ✨",

  // Lời chúc kết thúc (Cảnh 8)
  loiChucCuoi:
    "Chúc bạn tuổi 25 WOW hơn hôm qua, rực rỡ hơn hôm nay và tuyệt vời hơn mọi mong đợi!",

  /* --- Thư tay (quà bí mật) --- */
  tieuDeNutQua: "Mở thư tay",
  thuTay:
    "Gửi Linh Nhi,\n\n" +
    "Sinh nhật tuổi 25 rồi đó! Chúc bạn một năm mới rực rỡ đúng nghĩa: " +
    "công việc khởi sắc, tình cảm đong đầy, sức khoẻ dồi dào — và tất nhiên, " +
    "tiền thì nhiều thật nhiều như bạn vẫn luôn mong. 😄\n\n" +
    "Dù là cháy hết mình ở concert, tự tin nơi công sở xứ Hàn hay đứng giữa " +
    "Ngọc Long Tuyết Sơn 4506m — phiên bản nào của bạn cũng thật đáng nể. " +
    "Mong năm nay bạn đi được nhiều nơi hơn, cười nhiều hơn và sống thật trọn vẹn.\n\n" +
    "Happy Birthday! 🎂",
  kyTenThuTay: "— Nguyên Phong",

  /* --- Hành vi --- */
  ghiNhoTienTrinh: false,   // true = nhớ tiến trình khi tải lại
  choPhepBoQuaIntro: true,

  /* --- Song ngữ (mặc định tiếng Việt) --- */
  i18n: {
    hbd: "HAPPY BIRTHDAY"
  }
};
