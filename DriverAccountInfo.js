 const modal = document.getElementById('photoModal');
  const openBtn = document.querySelector('.change-photo');
  const closeBtn = document.getElementById('closeModal');

  openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });


document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.save-btn');
    const toast = document.getElementById('toast');

    submitButton.addEventListener('click', (e) => {
      e.preventDefault(); // prevent form from refreshing or submitting

      // Show toast message
      toast.classList.add('show');

      // Hide after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    });
  });


