// sprite.js
export class Sprite {
  constructor(image, frameWidth, frameHeight, frameCount, frameSpeed) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.frameSpeed = frameSpeed;

    this.frameX = 0;
    this.counter = 0;
  }

  update() {
    this.counter++;
    if (this.counter >= this.frameSpeed) {
      this.frameX = (this.frameX + 1) % this.frameCount;
      this.counter = 0;
    }
  }

  draw(ctx, x, y) {
    ctx.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth,
      this.frameHeight
    );
  }
}
