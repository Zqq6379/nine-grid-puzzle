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
        imageOrder.forEach((num, index) => {
            const img = document.createElement('img');
            img.src = `images/${num}.jpg`;
            img.classList.add('puzzle-piece');
            img.draggable = true;
            img.dataset.order = num;
            img.style.transform = `translate(${(index % 3) * 105}px, ${Math.floor(index / 3) * 105}px)`;
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
        const tempOrder = img1.dataset.order;
        img1.dataset.order = img2.dataset.order;
        img2.dataset.order = tempOrder;

        const tempTransform = img1.style.transform;
        img1.style.transform = img2.style.transform;
        img2.style.transform = tempTransform;
    }

    // 拖放事件处理
    let dragged, draggedIndex, offsetX, offsetY;

    puzzleContainer.addEventListener('dragstart', (event) => {
        dragged = event.target;
        draggedIndex = Array.from(puzzleContainer.children).indexOf(dragged);
        const rect = dragged.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        dragged.classList.add('dragging');
    });

    puzzleContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    puzzleContainer.addEventListener('drop', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('puzzle-piece') && event.target !== dragged) {
            const targetIndex = Array.from(puzzleContainer.children).indexOf(event.target);
            swapImages(dragged, event.target);
            if (checkWin()) {
                winAudio.play();
            }
        }
        dragged.classList.remove('dragging');
        dragged.style.transform = `translate(${(draggedIndex % 3) * 105}px, ${Math.floor(draggedIndex / 3) * 105}px)`;
    });

    document.addEventListener('dragend', (event) => {
        if (dragged) {
            dragged.classList.remove('dragging');
            dragged.style.transform = `translate(${(draggedIndex % 3) * 105}px, ${Math.floor(draggedIndex / 3) * 105}px)`;
        }
    });

    document.addEventListener('drag', (event) => {
        if (dragged) {
            dragged.style.transform = `translate(${event.clientX - offsetX}px, ${event.clientY - offsetY}px)`;
        }
    });

    // 触摸事件处理
    let touchStartX, touchStartY, touchStartElement, touchStartIndex;

    puzzleContainer.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartElement = document.elementFromPoint(touchStartX, touchStartY);
        touchStartIndex = Array.from(puzzleContainer.children).indexOf(touchStartElement);
        if (touchStartElement.classList.contains('puzzle-piece')) {
            const rect = touchStartElement.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
            touchStartElement.classList.add('dragging');
        }
    });

    puzzleContainer.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        if (touchStartElement) {
            touchStartElement.style.transform = `translate(${touch.clientX - offsetX}px, ${touch.clientY - offsetY}px)`;
        }
    });

    puzzleContainer.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        const touchEndElement = document.elementFromPoint(touchEndX, touchEndY);
        const touchEndIndex = Array.from(puzzleContainer.children).indexOf(touchEndElement);

        if (touchStartElement && touchEndElement && touchStartElement !== touchEndElement &&
            touchStartElement.classList.contains('puzzle-piece') &&
            touchEndElement.classList.contains('puzzle-piece')) {
            swapImages(touchStartElement, touchEndElement);
            if (checkWin()) {
                winAudio.play();
            }
        }
        if (touchStartElement) {
            touchStartElement.classList.remove('dragging');
            touchStartElement.style.transform = `translate(${(touchStartIndex % 3) * 105}px, ${Math.floor(touchStartIndex / 3) * 105}px)`;
        }
    });

    // 初始化拼图
    initPuzzle();
});
