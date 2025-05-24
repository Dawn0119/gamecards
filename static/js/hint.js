let currentMode = null; // 儲存是哪個按鈕打開的 modal

function openModal(mode) {
  currentMode = mode;
  const modal = document.getElementById('myModal');
  const message = document.getElementById('modalMessage');

  if (mode === 'showall') {
    message.textContent = '由於卡片過多，顯示速度會較慢，是否確認依然要選取此方式做查詢?';
  } else if (mode === 'choice') {
    message.textContent = '這是「自行選擇」模式的提示訊息。（之後可以自訂）';
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('myModal').classList.add('hidden');
}

function confirmAction() {
  if (currentMode === 'showall') {
    window.open('showall.html', '_blank');
  } else if (currentMode === 'choice') {
    window.open('choice.html', '_blank');
  }
  closeModal();
}

document.addEventListener("DOMContentLoaded", () => {
  const showAllButton = document.getElementById('showAllButton');
  const chooseButton = document.getElementById('chooseButton');
  const confirmButton = document.getElementById('confirmButton');

  if (showAllButton) {
    showAllButton.addEventListener('click', () => openModal('showall'));
  }

  if (chooseButton) {
    chooseButton.addEventListener('click', () => openModal('choice'));
  }

  if (confirmButton) {
    confirmButton.addEventListener('click', confirmAction);
  }

  // 合併 scroll 功能：變色 header + 顯示 top 按鈕
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const myBtn = document.getElementById('myBtn');

    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('bg-gray-900/80', 'shadow-lg');
      } else {
        header.classList.remove('bg-gray-900/80', 'shadow-lg');
      }
    }

    if (myBtn) {
      myBtn.style.display = window.scrollY > 20 ? "block" : "none";
    }
  });
});

// 返回頂部功能
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}