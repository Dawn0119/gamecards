let currentMode = null;

function switchMode(mode) {
    document.querySelectorAll('.mode-container').forEach(el => el.style.display = 'none');
    document.getElementById(`block-${mode}`).style.display = 'block';

    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('mode-one-active', 'mode-all-active', 'mode-choice-active');
    });

    document.querySelectorAll('.large-block').forEach(el => {
        el.classList.remove('mode-one-bg', 'mode-all-bg', 'mode-choice-bg');
    });

    const selectedBtn = document.querySelector(`.mode-button[data-mode="${mode}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add(`mode-${mode}-active`);
    }

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

function setupUploadEvents(mode) {
    const fileInput = document.getElementById(`fileInput-${mode}`);
    const selectButton = document.getElementById(`selectButton-${mode}`);
    const uploadArea = document.getElementById(`uploadArea-${mode}`);
    const fileNameDisplay = document.getElementById(`fileNameDisplay-${mode}`);
    const previewImage = document.getElementById(`previewImage-${mode}`);
    const progressContainer = uploadArea.querySelector('.progress-bar-container');
    const progressBar = uploadArea.querySelector('.progress-bar');

    selectButton.onclick = (e) => {
        e.stopPropagation();
        fileInput.click();
    };
    uploadArea.onclick = () => fileInput.click();

    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileNameDisplay.textContent = `已選取：${file.name}`;

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = e => {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';

                    previewImage.classList.remove('fade-in');

                    void previewImage.offsetWidth;

                    previewImage.classList.add('fade-in');
                };
                reader.readAsDataURL(file);
            }
            else {
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
    const title = document.querySelector('.modal-title');
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

window.onscroll = function () {
    const btn = document.getElementById("myBtn");
    if (!btn) return;
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}