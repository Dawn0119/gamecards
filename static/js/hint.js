let currentMode = null; // 儲存目前開啟的是哪一種模式


function switchMode(mode) {
    // 先全部隱藏
    document.getElementById('block-one').style.display = 'none';
    document.getElementById('block-all').style.display = 'none';
    document.getElementById('block-choice').style.display = 'none';

    // 顯示對應區塊
    document.getElementById(`block-${mode}`).style.display = 'block';
}
// 預設顯示第一個模式
window.onload = () => switchMode('one');
function openModal(mode, buttonText) {
    currentMode = mode;
    const modal = document.getElementById('myModal');
    const title = document.querySelector('.modal-title'); // class
    const message = document.getElementById('modalMessage');

    // 對應每個模式的標題文字
    const modeTitleMap = {
        one: '📌 單張顯示',
        all: '⚠️ 全部顯示',
        choice: '👆 自行選擇'
    };

    // 設定標題
    title.textContent = modeTitleMap[mode] || '提醒';

    if (mode === 'all') {
        message.innerHTML = '由於卡片過多<br>顯示速度會較慢<br>是否確定以此方式做搜尋？';
    } else if (mode === 'choice') {
        message.innerHTML = '不會顯示全部資訊<br>需自行選擇想要呈現的卡片<br>是否確定以此方式做搜尋？';
    } else if (mode === 'one') {
        message.innerHTML = '只會顯示一張卡片<br>是否確定以此方式做搜尋？';
    }
    // // 設定標題為按鈕文字
    // title.textContent = buttonText;

    // 顯示彈跳視窗
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('myModal').classList.add('hidden');
}

function confirmAction() {
    if (currentMode === 'all') {
        window.open('/all', '_blank');  // 跳轉到後端路由
    } else if (currentMode === 'choice') {
        window.open('/choice', '_blank');
    } else if (currentMode === 'one') {
        window.open('/one', '_blank');
    }
    closeModal();
}

// 當網頁向下滾動 20px 時，顯示按鈕
window.onscroll = function () { scrollFunction() };

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
