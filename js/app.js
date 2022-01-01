function randomChar() {
	const chars =
		'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>#$#%&|()=≈^*;ABCDEFGHIJKLMOPQRSTUVXYZ0123456789';
	return chars[Math.floor(Math.random() * chars.length)];
}

const canvas = document.querySelector('canvas');
const rows = 64;
const ctx = canvas.getContext('2d');

let size,
	cellSize,
	fontSize,
	isAnimating = true;

updateSize();

const cols = Math.floor(size.width / (size.height / rows)) + 1;
const currentRow = [];
while (currentRow.length < cols) {
	currentRow.push(Math.floor(Math.random() * rows));
}
const textRGB = [128, 255, 0];
const bgRGB = textRGB.map(c => Math.floor(c * 0.1) || 0);
const refreshRate = 20;
const fontFamily = 'Arial';

function updateSize() {
	const rect = canvas.getBoundingClientRect();
	size = {
		width: rect.width,
		height: rect.height,
	};
	canvas.width = size.width;
	canvas.height = size.height;
	cellSize = Math.ceil(size.height / rows);
	fontSize = Math.round(cellSize * 0.85);
}

function animate() {
	try {
		if (!isAnimating) return;

		ctx.fillStyle = `rgba(${bgRGB.join(',')},0.2)`;
		ctx.fillRect(0, 0, size.width, size.height);

		ctx.fillStyle = `rgba(${textRGB.join(',')}, 0.8)`;
		ctx.font = `bold ${fontSize || 16}px ${fontFamily}`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		const start = {
			x: (size.width - cellSize * cols) * 0.5,
			y: (size.height - cellSize * rows) * 0.5,
		};

		for (let col = 0; col < cols; col++) {
			const row = currentRow[col];

			currentRow[col] += Math.round(Math.random() * 2);
			if (currentRow[col] >= rows) {
				currentRow[col] = 0;
			}

			ctx.fillText(
				randomChar(),
				start.x + col * cellSize + cellSize * 0.5,
				start.y + row * cellSize + cellSize * 0.5
			);
		}
	} catch (e) {
		console.error(e);
		return;
	}
	setTimeout(() => {
		requestAnimationFrame(animate);
	}, 1000 / refreshRate || 0);
}

function toggleAnimation() {
	isAnimating = !isAnimating;
	isAnimating && animate();
}

ctx.fillStyle = `rgb(${bgRGB.join(',')})`;
ctx.fillRect(0, 0, size.width, size.height);

animate();

window.addEventListener('keydown', ev => ev.key === ' ' && toggleAnimation());
canvas.addEventListener('pointerdown', toggleAnimation);

window.addEventListener('resize', () => {
	updateSize();
	ctx.fillStyle = `rgba(${bgRGB.join(',')})`;
	ctx.fillRect(0, 0, size.width, size.height);
});
