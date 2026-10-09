export function arcCercle(
  ctx,
  x,
  y,
  radius,
  startAngle,
  endAngle,
  anticlockwise = false,
) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  ctx.stroke();
}

export function line(ctx, x1, y1, x2, y2) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function arcTo(ctx, x1, y1, x2, y2, radius) {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.moveTo(x1, y1);
  ctx.arcTo(x1, y2, x2, y1, radius);
  ctx.stroke();
}

export function strokeStar(ctx, x, y, r, n, inset) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.moveTo(0, 0 - r);
  for (var i = 0; i < n; i++) {
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - r * inset);
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
