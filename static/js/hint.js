let currentMode = null; // 儲存目前開啟的是哪一種模式

// function switchMode(mode) {
//     // 先全部隱藏
//     document.getElementById('block-one').style.display = 'none';
//     document.getElementById('block-all').style.display = 'none';
//     document.getElementById('block-choice').style.display = 'none';

//     // 顯示對應區塊
//     document.getElementById(`block-${mode}`).style.display = 'block';
// }
function switchMode(mode) {
    document.querySelectorAll('.mode-container').forEach(el => el.style.display = 'none');
    document.getElementById(`block-${mode}`).style.display = 'block';
}
// 檔案上傳區事件綁定
function setupUploadEvents(mode) {
    const fileInput = document.getElementById(`fileInput-${mode}`);
    const selectButton = document.getElementById(`selectButton-${mode}`);
    const uploadArea = document.getElementById(`uploadArea-${mode}`);
    const fileNameDisplay = document.getElementById(`fileNameDisplay-${mode}`);
    const previewImage = document.getElementById(`previewImage-${mode}`);
    const progressContainer = uploadArea.querySelector('.progress-bar-container');
    const progressBar = uploadArea.querySelector('.progress-bar');

    // if (!fileInput || !selectButton || !uploadArea || !fileNameDisplay) return;

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
                };
                reader.readAsDataURL(file);
            } else {
                previewImage.style.display = 'none';
            }
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
        one: '📌 單張顯示',
        all: '⚠️ 全部顯示',
        choice: '👆 自行選擇'
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
}

function closeModal() {
    document.getElementById('myModal').classList.add('hidden');
}

function confirmAction() {
    if (currentMode) window.open(`/${currentMode}`, '_blank');
    closeModal();
}

function createUploadBlockHTML(mode) {
    return `
        <input type="file" id="fileInput-${mode}" style="display:none;">
        <button id="selectButton-${mode}">選取檔案</button>
        <p>或拖曳檔案到此</p>
        <div class="file-name" id="fileNameDisplay-${mode}"></div>
        <img id="previewImage-${mode}" class="preview-image" style="display:none; max-width: 100%; margin-top: 10px;">
        <div class="progress-bar-container" style="display: none; width: 100%; background: #eee; border-radius: 10px; overflow: hidden; margin-top: 10px;">
            <div class="progress-bar" style="height: 10px; background: orange; width: 0%; transition: width 0.3s;"></div>
        </div>
    `;
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
