window.onload = () => {
    const container = document.getElementById('puzzle-container');
    const pieces = [];
    let audio = new Audio('music.mp3');

    for (let i = 1; i <= 9; i++) {
        const img = document.createElement('img');
        img.src = `images/${i}.jpg`;
        img.className = 'puzzle-piece';
        img.draggable = true;
        img.id = `piece-${i}`;
        img.dataset.correctPosition = i; // 设置正确位置
        pieces.push(img);
    }

    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(img => container.appendChild(img));

    let srcElement = null;

    pieces.forEach(img => {
        img.addEventListener('dragstart', e => srcElement = e.target);
        img.addEventListener('dragover', e => e.preventDefault());
        img.addEventListener('drop', e => {
            e.preventDefault();
            if (srcElement !== e.target) {
                [srcElement.src, e.target.src] = [e.target.src, srcElement.src];
                checkPuzzle();
            }
        });
    });

    function checkPuzzle() {
        const isComplete = pieces.every((img, index) => img.src.includes(`${index + 1}.jpg`));
        if (isComplete) {
            audio.play();
        }
    }
};