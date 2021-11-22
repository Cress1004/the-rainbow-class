import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
    },
  },
  vi: {
    translation: {
      welcome_message: "Chào mừng đến với Lớp học Cầu Vồng!",
      login: "Đăng nhập",
      email: "Địa chỉ email",
      password: "Mật khẩu",
      input_email: "Nhập địa chỉ email",
      input_password: "********",
      forgot_password: "Quên mật khẩu?",
      reset_password: "Đặt lại mật khẩu",
      reset_password_message:
        "Email cấp lại mật khẩu sẽ được gửi đến địa chỉ dưới đây:",
      reset_email: "Nhập vào địa chỉ email",
      password_confirm: "Nhập lại mật khẩu",
      input_password_confirm: "********",
      back_to_login: "Quay lại trang đăng nhập",
      logout: "Đăng xuất",
      profile: "Thông tin cá nhân",
      ok: "OK",
      class: "Lớp",
      class_list: "Danh sách các lớp học",
      class_name: "Tên lớp",
      address: "Địa chỉ",
      class_monitor: "Lớp trưởng",
      target_student: "Đối tượng",
      number_of_student: "Sĩ số",
      my_schedule: "Lịch dạy cá nhân",
      cancel: "Quay lại",
      //validation:
      invalid_email_message: "Địa chỉ email chưa đúng định dạng",
      required_email_message: "Hãy nhập vào địa chỉ email",
      required_password_message: "Hãy nhập vào mật khẩu",
      required_min_length_of_password_message:
        "Độ dài của mật khẩu cần lớn hơn 8 kí tự",
      required_confirm_password_message: "Hãy nhập lại mật khẩu để xác nhận",
      required_confirm_password_must_match_message:
        "Hãy nhập lại chính xác mật khẩu mới",
      login_fail_message: "Log Out Failed",
      error_email_or_password_message:
        "Email hoặc mật khẩu bạn nhập vào là không đúng, hãy kiểm tra lại",
      fail_to_login: "Check out your Account or Password again",
    },
  },
};
i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
