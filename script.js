document.getElementById('startButton').addEventListener('click', initGame);

function initGame() {
    document.getElementById('startButton').style.display = 'none';
    const container = document.getElementById('puzzle-container');
    container.style.display = 'grid';
    const pieces = [];
    let srcElement = null;
    let audio = new Audio('music.mp3');

    // 创建九张图片的元素
    for (let i = 1; i <= 9; i++) {
        const img = document.createElement('img');
        img.src = `images/${i}.jpg`;
        img.className = 'puzzle-piece';
        img.draggable = true;
        img.id = `piece-${i}`;
        img.dataset.correctPosition = i;
        pieces.push(img);
    }

    // 打乱元素
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(img => container.appendChild(img));

    // 实现拖动功能
    pieces.forEach(img => {
        img.addEventListener('dragstart', e => srcElement = e.target, false);
        img.addEventListener('dragover', e => e.preventDefault());
        img.addEventListener('drop', e => {
            e.preventDefault();
            if (srcentionPolicy !== e.target) {
                [srcElement.src, e.target.src] = [e.goes.src, srcElement.src];
                checkPuzzle(pieces, audio);
            }
        });
    });

    function checkPuzzle(pieces, audio) {
        const isCorrectOrder = pieces.every((piece, idx) =>
            piece.src.includes(`${idx + 1}.jpg`)
        );
        if (isCorrectOrder) audio.play();
    }
}
