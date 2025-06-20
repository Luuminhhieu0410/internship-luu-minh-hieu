document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded at", new Date().toISOString());

  const modal = document.getElementById("loyalty-modal");
  const modalBody = document.getElementById("loyalty-modal-body");
  const closeModalBtn = document.getElementById("loyalty-close-modal");
  const loyaltyBtn = document.getElementById("loyalty-btn");
  const customerId = modal?.dataset?.customerid || null;
  localStorage.setItem('customerId',customerId);
  console.log("Elements:", { modal, modalBody, closeModalBtn, loyaltyBtn });
  console.log("customerId:", customerId);

  if (!modal || !modalBody || !closeModalBtn || !loyaltyBtn) {
    console.error("Missing DOM elements");
    return;
  }

  async function checkCustomerPoints() {
    if (!customerId) {
      console.log("No customerId, returning default");
      return { customer_id: null, total_points: 0 };
    }

    const startTime = performance.now();
    try {
      console.log("Fetching points for customerId:", customerId);
      const response = await fetch(
        `/apps/api/loyalty/me?customerId=${customerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(
        "Points data:",
        data,
        `Took ${performance.now() - startTime}ms`,
      );
      return data;
    } catch (error) {
      console.error("Lỗi lấy điểm:", error);
      return null;
    }
  }

  async function fetchRedeemedCodes() {
    if (!customerId) {
      console.log("No customerId, returning empty codes");
      return [];
    }

    const startTime = performance.now();
    try {
      console.log("Fetching redeemed codes for customerId:", customerId);
      const response = await fetch(
        `/apps/api/loyalty/redeemed?customerId=${customerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(
        "Redeemed codes:",
        data,
        `Took ${performance.now() - startTime}ms`,
      );
      return data;
    } catch (error) {
      console.error("Không thể lấy mã giảm giá:", error);
      return null;
    }
  }

  async function updateModalContent() {
    const startTime = performance.now();
    const pointsData = await checkCustomerPoints();
    const redeemedCodes = await fetchRedeemedCodes();

    if (pointsData === null || redeemedCodes === null) {
      modalBody.innerHTML =
        '<p class="loyalty-login-text">Lỗi khi tải dữ liệu. Vui lòng thử lại!</p>';
      return;
    }

    const redeemedTable =
      redeemedCodes.length > 0
        ? `
      <div class="loyalty-table-wrapper">
        <table class="loyalty-table">
          <thead>
            <tr>
              <th>Mã giảm giá</th>
              <th>Giá trị</th>
              <th>Điểm đã dùng</th>
              <th>Ngày tạo</th>
              <th>Hết hạn</th>
              <th>Đã sử dụng</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${redeemedCodes
              .map((code) => {
                const isUsed = code.isUsed ? "Đã sử dụng" : "Chưa sử dụng";
                const isExpired =
                  new Date(code.expiresAt) < new Date()
                    ? "Đã hết hạn"
                    : "Còn hạn";
                return `
                  <tr>
                    <td><code>${code.code}</code></td>
                    <td>${code.amount.toLocaleString("vi-VN")}₫</td>
                    <td>${code.pointsUsed || "-"} điểm</td>
                    <td>${new Date(code.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td>${new Date(code.expiresAt).toLocaleDateString("vi-VN")}</td>
                    <td class="${code.isUsed ? "used" : "not-used"}">${isUsed}</td>
                    <td class="${new Date(code.expiresAt) < new Date() ? "expired" : "active"}">${isExpired}</td>
                    <td><button class="copy-btn" data-code="${code.code}">Copy</button></td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `
        : '<p class="loyalty-redeemed-empty">Bạn chưa nhận mã giảm giá nào!</p>';

    modalBody.innerHTML = `
      <div>
        <h3 class="loyalty-info-title">Thông tin chương trình</h3>
        <p class="loyalty-info-text">
          Chào mừng bạn đến với chương trình khách hàng thân thiết! Tích lũy điểm từ mỗi đơn hàng và đổi điểm để nhận mã giảm giá:
        </p>
        <ul class="loyalty-info-list">
          <li>Mua 1.000₫ = 1 điểm</li>
          <li>100 điểm = Mã giảm 10.000₫</li>
          <li>200 điểm = Mã giảm 20.000₫</li>
          <li>500 điểm = Mã giảm 50.000₫</li>
        </ul>
        ${
          customerId
            ? `
          <p class="loyalty-points-text">Số điểm hiện tại: <span class="loyalty-points-value">${
            pointsData.total_points || 0
          }</span></p>
          <p class="loyalty-redeem-label">Chọn mức đổi điểm:</p>
          <select id="loyalty-redeem-option" class="loyalty-redeem-select">
            <option value="100-10000">100 điểm = 10.000₫</option>
            <option value="200-20000">200 điểm = 20.000₫</option>
            <option value="500-50000">500 điểm = 50.000₫</option>
          </select>
          <button id="loyalty-submit-redeem" class="loyalty-redeem-btn">Đổi điểm</button>
        `
            : `<p class="loyalty-login-text">Vui lòng đăng nhập để sử dụng chương trình!</p>`
        }
        <h3 class="loyalty-redeemed-title">Mã giảm giá đã nhận</h3>
        ${redeemedTable}
      </div>
    `;

    console.log(
      "Modal content updated, took",
      performance.now() - startTime,
      "ms",
    );

    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-code");
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "Đã copy!";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2000);
        });
      });
    });

    const submitButton = document.getElementById("loyalty-submit-redeem");
    if (submitButton) {
      submitButton.addEventListener("click", async () => {
        console.log("Redeem button clicked at", new Date().toISOString());
        const [points, amount] = document
          .getElementById("loyalty-redeem-option")
          .value.split("-");
        const startTime = performance.now();
        submitButton.textContent = "Đang đổi điểm vui lòng chờ ...";
        submitButton.disabled = true; // Sửa từ disable thành disabled

        try {
          console.log("Sending redeem request:", { points, amount, customerId });
          const response = await fetch("/apps/api/loyalty/redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              points: parseInt(points),
              amount: parseInt(amount),
              customerId,
            }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          console.log(
            "Redeem result:",
            result,
            `Took ${performance.now() - startTime}ms`,
          );

          if (result.success) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              html: `Mã giảm giá: <strong>${result.code}</strong><br>${result.amount.toLocaleString("vi-VN")}₫`,
              confirmButtonColor: "#2e7d32",
            }).then(() => {
              modalBody.innerHTML =
                '<p class="loyalty-loading-text">Đang tải thông tin...</p>';
              updateModalContent(); // Tải lại modal
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: result.error || "Không đủ điểm hoặc lỗi hệ thống!",
              confirmButtonColor: "#d32f2f",
            });
          }
        } catch (error) {
          console.error("Error redeeming points:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể đổi điểm. Vui lòng thử lại!",
            confirmButtonColor: "#d32f2f",
          });
        } finally {
          submitButton.textContent = "Đổi điểm"; // Reset text
          submitButton.disabled = false; // Reset disabled
        }
      });
    }
  }

  function showModal() {
    console.log("Show modal triggered at", new Date().toISOString());
    modal.classList.add("show");
    updateModalContent();
  }

  function closeModal() {
    console.log("Closing modal at", new Date().toISOString());
    modal.classList.remove("show");
  }

  loyaltyBtn.addEventListener("click", () => {
    console.log("Loyalty button clicked at", new Date().toISOString());
    showModal();
  });

  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      console.log("Clicked outside modal at", new Date().toISOString());
      closeModal();
    }
  });
});
