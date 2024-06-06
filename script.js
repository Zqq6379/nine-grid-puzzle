document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const winAudio = document.getElementById('win-audio');
    let imageOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.backgroundImage = `url('images/${num}.jpg')`;
            piece.setAttribute('draggable', true);
            piece.setAttribute('data-id', num);
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragover', handleDragOver);
            piece.addEventListener('drop', handleDrop);
            puzzleContainer.appendChild(piece);
        });
    }

    let dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.stopPropagation(); // Stops some browsers from redirecting.
        e.preventDefault();
        if (dragSrcEl !== this) {
            const srcParent = dragSrcEl.parentNode;
            const tgt = e.currentTarget;

            srcParent.removeChild(dragSrcEl);
            tgt.parentNode.insertBefore(dragSrcEl, tgt);

            const pieces = document.querySelectorAll('.puzzle-piece');
            pieces.forEach(piece => {
                piece.addEventListener('dragstart', handleDragStart);
                piece.addEventListener('dragover', handleDragOver);
                piece.addEventListener('drop', handleDrop);
            });
        }
        checkWin();
        return false;
    }

    // 检查是否完成拼图
    function checkWin() {
        const currentOrder = Array.from(puzzleContainer.children).map(piece => parseInt(piece.getAttribute('data-id')));
        if (currentOrder.join('') === '123456789') {
            winAudio.play();
        }
    }

    initPuzzle();
});
