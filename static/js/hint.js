// hint.js

let currentMode = null; // 儲存是哪個按鈕打開的 modal

function openModal(mode) {
  currentMode = mode;

  const modal = document.getElementById('myModal');
  const message = document.getElementById('modalMessage');

  if (mode === 'showall') {
    message.textContent = '由於卡片過多，顯示速度會較慢，是否確認依然要選取此方式做查詢?';
  } else if (mode === 'myself') {
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
  } else if (currentMode === 'myself') {
    window.open('choice.html', '_blank');
  }
  closeModal();
}

// DOM 加載完成後綁定按鈕
document.addEventListener("DOMContentLoaded", () => {
  const showAllButton = document.getElementById('showAllButton');
  const chooseButton = document.getElementById('chooseButton');
  const confirmButton = document.getElementById('confirmButton');

  if (showAllButton) {
    showAllButton.addEventListener('click', () => openModal('showall'));
  }

  if (chooseButton) {
    chooseButton.addEventListener('click', () => openModal('myself'));
  }

  if (confirmButton) {
    confirmButton.addEventListener('click', confirmAction);
  }
});

// 當網頁向下滾動 20px 時，顯示按鈕
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// 當使用者點擊按鈕時，滾動到頁面頂部
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
