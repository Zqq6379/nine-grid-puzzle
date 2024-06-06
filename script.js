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
            if (parseInt(pieces[i].dataset.order) !== i + 1) {
                return false;
            }
        }
        return true;
    }

    // 交换图片位置
    function swapPieces(piece1, piece2) {
        const tempSrc = piece1.src;
        const tempOrder = piece1.dataset.order;
        piece1.src = piece2.src;
        piece1.dataset.order = piece2.dataset.order;
        piece2.src = tempSrc;
        piece2.dataset.order = tempOrder;
    }

    // 拖放事件处理
    let draggedPiece = null;

    puzzleContainer.addEventListener('dragstart', (e) => {
        draggedPiece = e.target;
    });

    puzzleContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    puzzleContainer.addEventListener('drop', (e) => {
        if (e.target.classList.contains('puzzle-piece')) {
            swapPieces(draggedPiece, e.target);
            if (checkWin()) {
                winAudio.play();
            }
        }
    });

    initPuzzle();
});
