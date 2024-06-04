document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('puzzle-container');
    let pieces = [];

    // 预加载并初始化拼图块
    for (let i = 1; i <= 9; i++) {
        const img = new Image();
        img.src = `images/${i}.jpg`;

        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.backgroundImage = `url('images/${i}.jpg')`;
        piece.setAttribute('data-id', i);
        pieces.push(piece);
    }
    
    // 打乱拼图块后添加到容器
    shuffleArray(pieces).forEach(piece => {
        container.appendChild(piece);
        piece.addEventListener('dragstart', handleDragStart, false);
        piece.addEventListener('dragover', handleDragOver, false);
        piece.addEventListener('drop', handleDrop, false);
    });

    let dragSrcEl = null;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.style.opacity = '0.6';
    }

    function handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl !== this) {
            const srcBackground = dragSrcEl.style.backgroundImage;
            dragSrcEl.style.backgroundImage = this.style.backgroundImage;
            this.style.backgroundImage = srcBackground;

            // Check whether completed
            checkIfCompleted();
        }
        this.style.opacity = '1';
        return false;
    }

    function checkIfCompleted() {
        const currentPlayerOrder = Array.from(container.children).map(elem => parseInt(elem.getAttribute('data-id')));
        const isCompleted = currentPlayerOrder.every((val, idx) => val === idx + 1);

        if (isCompleted) {
            document.getElementById('winning-music').play();
        }
    }
});
