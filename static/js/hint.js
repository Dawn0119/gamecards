let currentMode = null; // 儲存目前開啟的是哪一種模式

function switchMode(mode) {
    // 隱藏所有模式區塊
    document.querySelectorAll('.mode-container').forEach(el => el.style.display = 'none');
    // 顯示當前模式區塊
    document.getElementById(`block-${mode}`).style.display = 'block';

    // 移除所有按鈕的 active 樣式
    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('mode-one-active', 'mode-all-active', 'mode-choice-active');
    });

    // 移除所有 large-block 背景樣式
    document.querySelectorAll('.large-block').forEach(el => {
        el.classList.remove('mode-one-bg', 'mode-all-bg', 'mode-choice-bg');
    });

    // 設定目前選取按鈕的 active 樣式
    const selectedBtn = document.querySelector(`.mode-button[data-mode="${mode}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add(`mode-${mode}-active`);
    }

    // 設定目前區塊的背景樣式，.large-block 在 block-{mode} 下
    const selectedBlockLarge = document.querySelector(`#block-${mode} .large-block`);
    if (selectedBlockLarge) {
        selectedBlockLarge.classList.add(`mode-${mode}-bg`);
    }
}

function createUploadBlockHTML(mode) {
    return `
        <input type="file" id="fileInput-${mode}" style="display:none;">

        <div class="file-name" id="fileNameDisplay-${mode}"></div>

        <img id="previewImage-${mode}" class="preview-image" style="display:none;">

        <div class="progress-bar-container">
            <div class="progress-bar"></div>
        </div>

        <button id="selectButton-${mode}" class="upload-button">選取檔案</button>

        <p class="upload-hint">或拖曳檔案到此</p>
    `;
}


// function createUploadBlockHTML(mode) {
//     return `
//         <input type="file" id="fileInput-${mode}" style="display:none;">
//         <button id="selectButton-${mode}">選取檔案</button>
//         <p>或拖曳檔案到此</p>
//         <div class="file-name" id="fileNameDisplay-${mode}"></div>
//         <img id="previewImage-${mode}" class="preview-image" style="display:none; max-width: 100%; margin-top: 10px;">
//         <div class="progress-bar-container" style="display: none; width: 100%; background: #eee; border-radius: 10px; overflow: hidden; margin-top: 10px;">
//             <div class="progress-bar" style="height: 10px; background: orange; width: 0%; transition: width 0.3s;"></div>
//         </div>
//     `;
// }

// 檔案上傳區事件綁定
function setupUploadEvents(mode) {
    const fileInput = document.getElementById(`fileInput-${mode}`);
    const selectButton = document.getElementById(`selectButton-${mode}`);
    const uploadArea = document.getElementById(`uploadArea-${mode}`);
    const fileNameDisplay = document.getElementById(`fileNameDisplay-${mode}`);
    const previewImage = document.getElementById(`previewImage-${mode}`);
    const progressContainer = uploadArea.querySelector('.progress-bar-container');
    const progressBar = uploadArea.querySelector('.progress-bar');

    // 按鈕點擊觸發 input 點擊
    selectButton.onclick = (e) => {
        e.stopPropagation(); //  阻止點擊事件冒泡
        fileInput.click();
    };
    // 整個虛線框也能點擊選檔案
    uploadArea.onclick = () => fileInput.click();

    // 檔案選擇後顯示檔名
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileNameDisplay.textContent = `已選取：${file.name}`;

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = e => {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';

                    // 先移除舊的動畫 class（若有的話）
                    previewImage.classList.remove('fade-in');

                    // 觸發重繪（reflow），讓動畫能重新執行
                    void previewImage.offsetWidth;

                    // 再加上動畫 class
                    previewImage.classList.add('fade-in');
                };
                reader.readAsDataURL(file);
            }
            else {
                previewImage.style.display = 'none';
            }
            // 顯示進度條
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
            let percent = 0;
            const interval = setInterval(() => {
                percent += 10;
                progressBar.style.width = `${percent}%`;
                if (percent >= 100) clearInterval(interval);
            }, 100);
        }
    };

    // 拖曳時加樣式
    uploadArea.ondragover = e => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    };

    uploadArea.ondragleave = e => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    };

    uploadArea.ondrop = e => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            fileInput.onchange();
        }
    };
}

function openModal(mode) {
    currentMode = mode;
    const modal = document.getElementById('myModal');
    const title = document.querySelector('.modal-title'); // class
    const message = document.getElementById('modalMessage');

    const modeTitleMap = {
        one: '單張顯示 📌',
        all: '⚠️ 全部顯示',
        choice: '自行選擇 👆'
    };

    title.textContent = modeTitleMap[mode] || '提醒';

    if (mode === 'all') {
        message.innerHTML = '由於卡片過多<br>顯示速度會較慢<br>是否確定以此方式做搜尋？';
    } else if (mode === 'choice') {
        message.innerHTML = '不會顯示全部資訊<br>需自行選擇想要呈現的卡片<br>是否確定以此方式做搜尋？';
    } else if (mode === 'one') {
        message.innerHTML = '只會顯示一張卡片<br>是否確定以此方式做搜尋？';
    }

    modal.classList.remove('hidden');
    console.log('openModal called');

}

function closeModal() {
    document.getElementById('myModal').classList.add('hidden');
}

function confirmAction() {
    if (currentMode) window.open(`/${currentMode}`, '_blank');
    closeModal();
}

window.onload = () => {
    switchMode('one');
    ['one', 'all', 'choice'].forEach(mode => {
        const area = document.getElementById(`uploadArea-${mode}`);
        area.innerHTML = createUploadBlockHTML(mode);
        setupUploadEvents(mode);
    });
};

// 當網頁向下滾動 20px 時，顯示按鈕
window.onscroll = function () {
    const btn = document.getElementById("myBtn");
    if (!btn) return;
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

// 當使用者點擊按鈕時，滾動到頁面頂部
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}