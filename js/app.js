function randomChar() {
	const chars =
		'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>#$#%&|()=≈^*±+?π†;_-±ABCDEFGHIJKLMOPQRSTUVXYZ0123456789';
	return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Number} rowCount
 */
function updateCanvasSize(canvas, rowCount, dpr = 1) {
	const rect = canvas.getBoundingClientRect(),
		width = rect.width * dpr,
		height = rect.height * dpr,
		cellSize = Math.ceil(height / rowCount);
	canvas.width = width;
	canvas.height = height;
	return {
		size: { width: width, height: height },
		cellSize: cellSize,
		fontSize: Math.round(cellSize * 0.85),
		colCount: Math.floor(width / (height / rowCount)) + 1,
	};
}
/**
 * @param {Number[]} rgbArr
 * @param {Number} alpha
 * @returns {String}
 */
function rgbToString(rgbArr, alpha = 1) {
	const values = rgbArr.join(',');
	return alpha !== 1 ? `rgba(${values},${alpha})` : `rgb(${values})`;
}

/**
 * @param {Number} rowCount
 * @param {Number} colCount
 * @param {Number} [colPositions]
 * @returns {Number[][]}
 */
function initRowPositions(rowCount, colCount, colPositions = 2) {
	const cols = [];
	while (cols.length < colCount) {
		const col = [];
		while (col.length < colPositions) {
			col.push(Math.floor(Math.random() * rowCount));
		}
		cols.push(col);
	}
	return cols;
}

// SETUP - GLOBAL VARIABLES
const canvas = document.querySelector('canvas'),
	ctx = canvas.getContext('2d'),
	dpr = 1,
	rowCount = 64,
	refreshRate = 20,
	textRGB = [128, 255, 0],
	bgRGB = textRGB.map(c => Math.floor(c * 0.1) || 0),
	fontFamily = 'Courier New, monospace';

ctx.imageSmoothingEnabled = false;

let isAnimating = true;
let { size, cellSize, fontSize, colCount } = updateCanvasSize(
	canvas,
	rowCount,
	dpr
);
let currentRows = initRowPositions(rowCount, colCount);

ctx.fillStyle = rgbToString(bgRGB);
ctx.fillRect(0, 0, size.width, size.height);

// ANIMATION LOOP
function animate() {
	try {
		if (!isAnimating) return;

		ctx.fillStyle = rgbToString(bgRGB, 0.25);
		ctx.fillRect(0, 0, size.width, size.height);

		ctx.fillStyle = rgbToString(textRGB, 0.75);
		ctx.font = `bold ${fontSize || 16}px ${fontFamily}`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		const start = {
			x: (size.width - cellSize * colCount) * 0.5,
			y: (size.height - cellSize * rowCount) * 0.5,
		};

		for (let col = 0; col < colCount; col++) {
			const rows = currentRows[col];
			rows.forEach((row, i) => {
				ctx.fillText(
					randomChar(),
					start.x + col * cellSize + cellSize * 0.5,
					start.y + row * cellSize + cellSize * 0.5
				);
				rows[i] = row + Math.round(Math.random() * 2);
				if (rows[i] >= rowCount) rows[i] = 0;
			});
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

// EVENT LISTENERS
window.addEventListener('keydown', ev => ev.key === ' ' && toggleAnimation());
canvas.addEventListener('pointerdown', toggleAnimation);

window.addEventListener('resize', () => {
	({ size, cellSize, fontSize, colCount } = updateCanvasSize(
		canvas,
		rowCount,
		dpr
	));
	currentRows = initRowPositions(rowCount, colCount);
	ctx.fillStyle = rgbToString(bgRGB);
	ctx.fillRect(0, 0, size.width, size.height);
});

animate();
