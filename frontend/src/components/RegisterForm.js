import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Dùng icon từ react-icons
import "../assets/css/Register.css";

const RegisterForm = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, "Tên quá ngắn!")
      .max(50, "Tên quá dài!")
      .required("Tên là bắt buộc"),
    emailOrPhone: Yup.string()
      .matches(
        /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$|^\d{10,12}$/,
        "Email hoặc số điện thoại không hợp lệ"
      )
      .required("Email hoặc Số điện thoại là bắt buộc"),
    password: Yup.string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .required("Mật khẩu là bắt buộc"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
    dateOfBirth: Yup.date()
      .nullable()
      .required("Ngày sinh là bắt buộc")
      .test(
        "is-18",
        "Bạn phải trên 18 tuổi để đăng ký",
        (value) => calculateAge(value) >= 18
      ),
    gender: Yup.string()
      .oneOf(["Nam", "Nữ", "Khác"], "Giới tính không hợp lệ")
      .required("Giới tính là bắt buộc"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      emailOrPhone: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      gender: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const isEmailExist = users.some(
        (user) => user.emailOrPhone === values.emailOrPhone
      );

      if (isEmailExist) {
        setErrorMessage("Email đã tồn tại, vui lòng thử email khác.");
      } else {
        users.push(values);
        localStorage.setItem("users", JSON.stringify(users));
        setSuccessMessage("Đăng ký thành công!");
        setErrorMessage(null);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    },
  });

  return (
    <div className="register-form-container">
      <h2>Tạo tài khoản mới</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Tên đầy đủ của bạn"
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <p className="error-message">{formik.errors.fullName}</p>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="emailOrPhone"
            value={formik.values.emailOrPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Email hoặc Số điện thoại"
          />
          {formik.touched.emailOrPhone && formik.errors.emailOrPhone && (
            <p className="error-message">{formik.errors.emailOrPhone}</p>
          )}
        </div>
        <div className="form-group password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Mật khẩu"
          />
          <span
            className="icon"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {formik.touched.password && formik.errors.password && (
            <p className="error-message">{formik.errors.password}</p>
          )}
        </div>
        <div className="form-group password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Xác nhận mật khẩu"
          />
          <span
            className="icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ cursor: "pointer" }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="error-message">{formik.errors.confirmPassword}</p>
          )}
        </div>
        <div className="form-group">
          <input
            type="date"
            name="dateOfBirth"
            value={formik.values.dateOfBirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <p className="error-message">{formik.errors.dateOfBirth}</p>
          )}
        </div>
        <div className="form-group">
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="error-message">{formik.errors.gender}</p>
          )}
        </div>
        <button type="submit" className="register-button">
          Đăng ký
        </button>
      </form>
      <p className="login-text">
        Đã có tài khoản?{" "}
        <button
          className="login-button"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
