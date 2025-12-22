export function drawFullText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  color: string
) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";

  const padding = 15;
  const maxWidth = canvas.width - padding * 2;

  const lines = text.split("\n");

  let y = padding;
  for (const line of lines) {
    ctx.fillText(line, padding, y, maxWidth);
    y += parseInt(font) * 1.3;
  }
}
