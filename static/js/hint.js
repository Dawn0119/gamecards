document.addEventListener('DOMContentLoaded', function() {
    const singleButton = document.querySelector('.button-container button:nth-child(1)');
    const allButton = document.querySelector('.button-container button:nth-child(2)');
    const choiceButton = document.querySelector('.button-container button:nth-child(3)');
    const searchButton = document.querySelector('.search-button');

    singleButton.addEventListener('click', function() {
        document.querySelector('.upload-block').style.backgroundColor = 'orange';
    });

    allButton.addEventListener('click', function() {
        document.querySelector('.upload-block').style.backgroundColor = 'plum';
    });

    choiceButton.addEventListener('click', function() {
        document.querySelector('.upload-block').style.backgroundColor = 'lightgreen';
    });

    searchButton.addEventListener('click', function() {
        const backgroundColor = document.querySelector('.upload-block').style.backgroundColor;
        let message = '';

        if (backgroundColor === 'orange') {
            message = '單張顯示的警告訊息';
        } else if (backgroundColor === 'plum') {
            message = '全部顯示的警告訊息';
        } else if (backgroundColor === 'lightgreen') {
            message = '自行選擇的警告訊息';
        } else {
            message = '預設的警告訊息';
        }

        alert(message);
    });
});
