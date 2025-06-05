import React, { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import PageLoadingSpinner from "../../Components/Loading/PageLoadingSpinner";
import { verifyAcountAction } from "../../Redux/Actions/AuthAction/AuthAction";
function AccountVerification() {
  const [searchParams] = useSearchParams();
  const { email, token } = Object.fromEntries([...searchParams]);

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      setError(true);
      setVerifying(false);
      return;
    }

    const verify = async (dispatch) => {
      try {
        await dispatch(verifyAcountAction(email, token));
        setVerified(true);
      } catch (err) {
        // đã xử lý lỗi ở action
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [email, token]);

  // ❌ Nếu thiếu param hoặc lỗi xác thực thì chuyển 404
  if (!email || !token || error) {
    return <Navigate to="/404" />;
  }

  // ⏳ Hiển thị khi đang xác thực
  if (verifying) {
    return <PageLoadingSpinner caption="Đang xác thực tài khoản..." />;
  }

  // ✅ Xác thực thành công, chuyển về trang login
  if (verified) {
    return <Navigate to={`/login`} />;
  }

  // Trường hợp fallback nếu không khớp điều kiện nào
  return null;
}

export default AccountVerification;
