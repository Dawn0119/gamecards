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
function openModal(mode) {
    currentMode = mode;
    const modal = document.getElementById('myModal');
    const message = document.getElementById('modalMessage');

    if (mode === 'all') {
        message.textContent = '⚠️ 由於卡片過多，顯示速度會較慢，是否確認依然要選取此方式做查詢？';
    } else if (mode === 'choice') {
        message.textContent = '📌 請確認已正確勾選要顯示的檔案，是否繼續查詢？';
    } else if (mode === 'one') {
        message.textContent = '📄 目前選擇為單張顯示，是否確定要查詢此檔案？';
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('myModal').classList.add('hidden');
}

function confirmAction() {
    if (currentMode === 'all') {
        window.open('all.html', '_blank');
    } else if (currentMode === 'choice') {
        window.open('choice.html', '_blank');
    } else if (currentMode === 'single') {
        window.open('single.html', '_blank');
    }
    closeModal();
}
