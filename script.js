document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const winAudio = document.getElementById('win-audio');
    const imageOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // 随机打乱图片顺序
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 初始化拼图
    function initPuzzle() {
        shuffle(imageOrder);
        puzzleContainer.innerHTML = '';
        imageOrder.forEach(num => {
            const img = document.createElement('img');
            img.src = `images/${num}.jpg`;
            img.classList.add('puzzle-piece');
            img.draggable = true;
            img.dataset.order = num;
            puzzleContainer.appendChild(img);
        });
    }

    // 检查拼图是否完成
    function checkWin() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].dataset.order != i + 1) {
                return false;
            }
        }
        return true;
    }

    // 交换图片位置
    function swapImages(img1, img2) {
        const tempSrc = img1.src;
        const tempOrder = img1.dataset.order;
        img1.src = img2.src;
        img1.dataset.order = img2.dataset.order;
        img2.src = tempSrc;
        img2.dataset.order = tempOrder;
    }

    // 拖放事件处理
    let dragged;

    puzzleContainer.addEventListener('dragstart', (event) => {
        dragged = event.target;
    });

    puzzleContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    puzzleContainer.addEventListener('drop', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('puzzle-piece') && event.target !== dragged) {
            swapImages(dragged, event.target);
            if (checkWin()) {
                winAudio.play();
            }
        }
    });

    // 初始化拼图
    initPuzzle();
});
