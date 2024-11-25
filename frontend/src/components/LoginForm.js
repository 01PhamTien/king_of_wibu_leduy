import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const LoginForm = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra nếu là admin
    if (emailOrPhone === "admin" && password === "admin123") {
      localStorage.setItem("adminToken", "your_admin_token");
      localStorage.setItem("loggedInUser", JSON.stringify({ name: "Admin", role: "admin" }));
      navigate("/admin"); // Điều hướng đến trang quản trị (admin)
    } else {
      // Kiểm tra thông tin đăng nhập của người dùng
      const user = users.find(
        (user) => user.emailOrPhone === emailOrPhone && user.password === password
      );

      if (user) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        navigate("/home"); // Điều hướng đến trang Home
      } else {
        // Nếu không tìm thấy thông tin hợp lệ
        setErrorMessage("Tên đăng nhập hoặc mật khẩu không hợp lệ");
      }
    }
  };

  const handleGoogleLogin = () => {
    alert("Chức năng đăng nhập bằng Google đang được phát triển!");
    // TODO: Tích hợp Google OAuth
  };

  const handleFacebookLogin = () => {
    alert("Chức năng đăng nhập bằng Facebook đang được phát triển!");
    // TODO: Tích hợp Facebook OAuth
  };

  return (
    <div className="login-form-container">
      <h2>Đăng nhập</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email hoặc Số điện thoại:</label>
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-login">Đăng nhập</button>
      </form>

      <div className="social-login-container">
        <p>Hoặc đăng nhập bằng:</p>
        <button className="btn-google" onClick={handleGoogleLogin}>
          Google
        </button>
        <button className="btn-facebook" onClick={handleFacebookLogin}>
          Facebook
        </button>
      </div>

      <div className="register-link-container">
        <p>Chưa có tài khoản?</p>
        <Link to="/register" className="register-link">Đăng ký ngay</Link>
      </div>
    </div>
  );
};

export default LoginForm;
