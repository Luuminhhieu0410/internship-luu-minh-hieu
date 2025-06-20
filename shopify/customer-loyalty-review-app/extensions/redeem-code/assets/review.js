class Review {
  constructor() {
    this.selectedImages = [];
    this.apiUrl = '/apps/api/reviews';
    const container = document.querySelector('[data-product-id]');
    this.productId = container?.dataset.productId || '';
    this.customerId = localStorage.getItem('customerId');
    this.init();
  }

  init() {
    console.log('Khởi tạo Review, productId:', this.productId, 'customerId:', this.customerId);
    this.setupEventListeners();
    this.loadReviews();
  }

  setupEventListeners() {
    const imageUpload = document.getElementById('imageUpload');
    const reviewForm = document.getElementById('reviewForm');
    const starInputs = document.querySelectorAll('.star-rating input');
    const modalButton = document.querySelector('[data-bs-toggle="modal"]');
    const modal = document.getElementById('ratingModal');

    if (modalButton && modal) {
      modalButton.addEventListener('click', () => {
        console.log('Nhấn Viết đánh giá');
        if (typeof bootstrap !== 'undefined') {
          new bootstrap.Modal(modal).show();
        } else {
          console.warn('Bootstrap chưa tải, mở modal thủ công');
          modal.classList.add('show');
          modal.style.display = 'block';
          document.body.classList.add('modal-open');
        }
      });
      modal.addEventListener('show.bs.modal', () => console.log('Modal hiển thị'));
    } else {
      console.error('Không tìm thấy nút modal hoặc #ratingModal');
    }

    if (imageUpload) {
      imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    starInputs.forEach((input) =>
      input.addEventListener('change', () => this.handleStarRating(input))
    );
  }

  handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (!previewContainer) return;

    files.forEach((file) => {
      if (file.type.startsWith('image/') && file.size > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages.push({ file, dataUrl: e.target.result });
          this.renderPreviews();
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = '';
  }

  removeImage(index) {
    this.selectedImages.splice(index, 1);
    this.renderPreviews();
  }

  renderPreviews() {
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (!previewContainer) return;
    previewContainer.innerHTML = '';

    this.selectedImages.forEach((image, index) => {
      const previewDiv = document.createElement('div');
      previewDiv.className = 'image-preview';
      const img = document.createElement('img');
      img.src = image.dataUrl;
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '×';
      deleteBtn.addEventListener('click', () => this.removeImage(index));
      previewDiv.append(img, deleteBtn);
      previewContainer.appendChild(previewDiv);
    });
  }

  handleStarRating(input) {
    const ratingValue = document.getElementById('rating-value');
    const ratingInput = document.getElementById('rating');
    if (ratingValue && ratingInput) {
      ratingValue.textContent = input.value;
      ratingInput.value = input.value;
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    if (this.customerId) formData.set('customerId', this.customerId);
    this.selectedImages.forEach((image) => formData.append('images', image.file));

    try {
      const response = await fetch(this.apiUrl, { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        alert('Đánh giá gửi thành công!');
        this.selectedImages = [];
        this.renderPreviews();
        form.reset();
        document.getElementById('rating-value').textContent = '0';
        document.getElementById('rating').value = '0';
        document.querySelectorAll('.star-rating input').forEach((input) => (input.checked = false));
        if (typeof bootstrap !== 'undefined') {
          bootstrap.Modal.getInstance(document.getElementById('ratingModal')).hide();
        } else {
          const modal = document.getElementById('ratingModal');
          modal.classList.remove('show');
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
        }
        this.loadReviews();
      } else {
        alert('Lỗi: ' + (result.error || 'Thất bại'));
      }
    } catch (error) {
      alert('Lỗi gửi đánh giá: ' + error.message);
    }
  }

  async loadReviews() {
    try {
      const response = await fetch(`${this.apiUrl}?productId=${this.productId}`);
      const data = await response.json();
      const reviewsContainer = document.getElementById('reviews-container');
      if (!reviewsContainer) return;

      if (data.success && Array.isArray(data.reviews)) {
        const totalReviews = data.reviews.length;
        const averageRating = totalReviews
          ? (data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
          : '0.0';
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.reviews.forEach((r) => r.rating && ratingCounts[r.rating]++);

        document.getElementById('average-rating').textContent = averageRating;
        document.getElementById('review-count').textContent = `Dựa trên ${totalReviews} đánh giá`;

        const starContainer = document.getElementById('star-display');
        if (starContainer) {
          starContainer.innerHTML = '';
          const fullStars = Math.floor(averageRating);
          const hasHalfStar = averageRating % 1 >= 0.5;
          for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            star.className =
              'bi bi-star' + (i < fullStars ? '-fill' : hasHalfStar && i === fullStars ? '-half' : '');
            star.classList.add('text-warning');
            starContainer.appendChild(star);
          }
        }

        for (let i = 1; i <= 5; i++) {
          const percentElement = document.getElementById(`percent-${i}`);
          const progressBar = document.getElementById(`progress-${i}`);
          if (percentElement && progressBar) {
            const percent = totalReviews ? ((ratingCounts[i] / totalReviews) * 100).toFixed(0) : 0;
            percentElement.textContent = `${percent}%`;
            progressBar.style.width = `${percent}%`;
            progressBar.setAttribute('aria-valuenow', percent);
          }
        }

        reviewsContainer.innerHTML = data.reviews
          .map((review) => {
            const createdAt = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString()
              : 'Không rõ';
            const images = Array.isArray(review.images) ? review.images : [];
            return `
              <div class="review-item">
                <div class="d-flex align-items-center mb-2">
                  <div>
                    ${Array(review.rating || 0)
                      .fill()
                      .map(() => '<i class="bi bi-star-fill text-warning"></i>')
                      .join('')}
                    ${Array(5 - (review.rating || 0))
                      .fill()
                      .map(() => '<i class="bi bi-star text-warning"></i>')
                      .join('')}
                  </div>
                  <small class="text-muted ms-2">${createdAt}</small>
                </div>
                <p>${review.content || 'Không có nội dung'}</p>
                ${images.length ? `<div class="review-images">${images.map((img) => `<img src="${img.url || ''}" alt="Ảnh đánh giá">`).join('')}</div>` : ''}
              </div>
            `;
          })
          .join('');
      } else {
        reviewsContainer.innerHTML = '<p class="text-muted">Chưa có đánh giá.</p>';
        document.getElementById('average-rating').textContent = '0.0';
        document.getElementById('review-count').textContent = 'Dựa trên 0 đánh giá';
        document.getElementById('star-display').innerHTML = Array(5)
          .fill()
          .map(() => '<i class="bi bi-star text-warning"></i>')
          .join('');
        for (let i = 1; i <= 5; i++) {
          document.getElementById(`percent-${i}`).textContent = '0%';
          document.getElementById(`progress-${i}`).style.width = '0%';
          document.getElementById(`progress-${i}`).setAttribute('aria-valuenow', '0');
        }
      }
    } catch (error) {
      reviewsContainer.innerHTML = '<p class="text-danger">Lỗi tải đánh giá.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new Review());